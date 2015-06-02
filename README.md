# Glyph, a versatile SVG icon set 

http://glyph.smarticons.co

![Preview](https://raw.githubusercontent.com/frexy/glyph-iconset/master/cover.png)

Glyph is a collection of ~800 beautiful pixel-perfect SVG icons, designed for the modern web. Glyph is 16x16, but because it's SVG, it can be any size you want.

Check it out at SmartIcons: https://smarticons.co/set/glyph

## Usage

There are many ways to put an SVG icon into your web page. 

### IMG tag

```
<img src="svg/si-glyph-bicycle-man.svg">
```
You can use IMG tag like a normal image.

### Inline SVG

Or you can copy the SVG content and paste it into your HTML.

### SVG Sprite

The most elegant way to use SVG icons is SVG sprite, demonstrated in ```sample.html```.

```
<svg xmlns="http://www.w3.org/2000/svg" class="si-glyph-bubble-message-hi">
    <use xlink:href="sprite.svg#si-glyph-bubble-message-hi" />
</svg>
```

This method makes use of the ```<use>``` tag to link a part of SVG content from a SVG sprite file into your HTML.


## Style with CSS

Using inline SVG and sprite methods, you can style your icon with CSS easily. Glyph is carefully made so that you can change all or some icons color with just these simple CSS snippet below.


Style the whole set

```
.si-glyph * {
    fill: red;
}
```

Style some specified icons

```
.si-glyph-bubble-message-hi {
    fill: blue;
}
```

### Attention please

Currently, xlinked elements can not be styled with CSS in webkit-based and IE. So if you're gonna use the sprite method, remember to put the file ```polyfill.js``` before </head> tag, it will make the CSS works. Hopefully we can remove it in the near future.

The polyfill repo is here: https://github.com/frexy/svg-sprite-polyfill

That's it!

## Todo
*   Sprite generator.
*   New icons.

## License

Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
