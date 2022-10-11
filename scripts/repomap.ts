#!/usr/bin/env deno
import { walk } from "https://deno.land/std@0.159.0/fs/mod.ts";

type PackageEntry =
  & Record<"name" | "version" | "description" | "path", string>
  & { dirs: string[] };

const walking = walk(new URL("../", import.meta.url), {
  includeDirs: false,
  exts: [".mjs"],
});

const cwd = Deno.cwd();
const entries: PackageEntry[] = [];
for await (const step of walking) {
  const path = step.path.replace(cwd, "");
  const { default: { name, version, description } } = await import(step.path);
  if (!name || !version || !description) {
    const missing = Object.keys({ name, version, description })
      .filter((key) =>
        !Object.getOwnPropertyDescriptor({ name, version, description }, key)
          ?.value
      )
      .map((key) => `\`${key}\``)
      .join(", ");

    throw new Deno.errors.InvalidData(
      `Package ${name} is missing: ${missing}`,
    );
  }
  if (description.length > 100) {
    throw new Deno.errors.InvalidData(
      `Package ${name} has a description longer than 100 characters`,
    );
  }

  const dirs = path.replace("truffle.config.mjs", "").split("/").filter((x) =>
    x.length
  );
  const entry = { name, version, description, path, dirs };
  entries.push(entry);
}

const rootPackages = entries.filter(({ dirs }) => dirs.length === 1);

const examples = entries.filter(({ dirs }) =>
  dirs.length === 2 && dirs[0] === "examples"
);

const streamProjects = entries.filter(({ dirs }) =>
  dirs.length === 2 && dirs[0] === "stream-projects"
);

const entryToString = ({ name, version, description, dirs }) =>
  `[${name}@\`${version}\`](./${dirs.join("/")}) - ${
    description ?? "No description"
  }`;

const data = `
**Packages**  
${rootPackages.map(entryToString).join("  \n")}

**Examples**  
${examples.map(entryToString).join("  \n")}

**Stream Projects**  
${streamProjects.map(entryToString).join("  \n")}
`;

const readmePath = new URL("../README.md", import.meta.url);
const readme = await Deno.readTextFile(readmePath);
const newReadme = readme.replace(
  /<!-- START PACKAGES -->(.|\n)*<!-- END PACKAGES -->/,
  `<!-- START PACKAGES -->\n${data}\n<!-- END PACKAGES -->`,
);
await Deno.writeTextFile(readmePath, newReadme);
console.log("Successfully updated README.md repomap");

Deno.exit(0);
