# Hugo Theme Anya

A simple theme for bloggers.

[Documentation](https://github.com/Limbend/hugo-anya/wiki)

## Demo

[Example Blog](https://dotgs.ru)

## Requirements

It's necessary to use **Hugo ≥ 0.78.0**.

Use Hugo Extended version (recommended) if you want to:

- Use the latest feature/fix from main branch
- Edit SCSS files

## Features

- Responsive and Mobile-Friendly
- Dark mode(It can switch automatically or manually)
- Footnotes(Float on the right side)
- Search with categories filter

## Installation

`cd` into your site's root dir.

1. Add `hugo-anya` theme as submodule.

```bash
git submodule add https://github.com/Limbend/hugo-anya themes/hugo-anya
```

2. Add `articles` page with [archives](https://github.com/Limbend/hugo-anya/wiki/Layout#archives) layout.

```bash
cat > content/articles.md <<EOF
---
title: Articles
subtitle: Posts, tutorials, snippets, musings, and everything else.
sectiontarget: post
layout: "archives"
---
EOF
```

Edit your site config following [exampleSite/config.yaml](https://github.com/Limbend/hugo-anya/blob/main/exampleSite/config.yaml).

## Thanks to

- [WingLim](https://github.com/WingLim) (This project is a fork of [Hugo Tania](https://github.com/WingLim/hugo-tania))

## License

[MIT](https://github.com/Limbend/hugo-anya/blob/main/LICENSE)
