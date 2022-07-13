We could support React Native with this. Where we'd probably want to have
.dist.js exports use:

```
{
    ReactComponent,
    // so other files know how to parse this component's export
    _componentFormatSlug: "react-native",
    _componentFormatSemver: "1", // wc@1 is { tagName, webComponent, libSlug, libSemver}
  }
```
