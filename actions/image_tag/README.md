# `image_tag`
> Generate a tag for a Docker image

## Usage
```yaml
- 
	name: Generate Image Tag
	id: generate_tag
	uses: ./.github/actions/image_tag

- 
	name: Docker meta
    id: meta
    uses: docker/metadata-action@v4
    with:
		images: ${{ env.slug }}
		tags: |
		type=raw,value=latest
		type=raw,value=${{ steps.generate_tag.outputs.tag }}
```
