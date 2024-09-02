var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@create-figma-plugin/utilities/lib/ui.js
function showUI(options, data) {
  if (typeof __html__ === "undefined") {
    throw new Error("No UI defined");
  }
  const html = `<div id="create-figma-plugin"></div><script>document.body.classList.add('theme-${figma.editorType}');const __FIGMA_COMMAND__='${typeof figma.command === "undefined" ? "" : figma.command}';const __SHOW_UI_DATA__=${JSON.stringify(typeof data === "undefined" ? {} : data)};${__html__}</script>`;
  figma.showUI(html, __spreadProps(__spreadValues({}, options), {
    themeColors: typeof options.themeColors === "undefined" ? true : options.themeColors
  }));
}
var init_ui = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/ui.js"() {
  }
});

// node_modules/@create-figma-plugin/utilities/lib/index.js
var init_lib = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/index.js"() {
    init_ui();
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
function main_default() {
  showUI({
    width: 350,
    height: 640
  });
}
function generateRandomHSLColor() {
  const hue = Math.random() * 360;
  const saturation = 0.6;
  const lightness = 0.5;
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs(hue / 60 % 2 - 1));
  const m = lightness - c / 2;
  let r, g, b;
  if (hue < 60) {
    [r, g, b] = [c, x, 0];
  } else if (hue < 120) {
    [r, g, b] = [x, c, 0];
  } else if (hue < 180) {
    [r, g, b] = [0, c, x];
  } else if (hue < 240) {
    [r, g, b] = [0, x, c];
  } else if (hue < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }
  return {
    r: r + m,
    g: g + m,
    b: b + m
  };
}
async function generatePreview(inputText, selectedFonts) {
  var _a;
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  const fontFrames = [];
  for (const fontFamily of selectedFonts) {
    const familyStyles = fonts.filter((font) => font.fontName.family === fontFamily);
    let currentFontStyle = (_a = familyStyles[0]) == null ? void 0 : _a.fontName;
    if (!currentFontStyle) {
      console.warn(`No styles found for font family: ${fontFamily}. Skipping this family.`);
      continue;
    }
    try {
      await figma.loadFontAsync(currentFontStyle);
    } catch (error) {
      console.warn(`Failed to load font: ${currentFontStyle.family} ${currentFontStyle.style}. Skipping this family.`);
      continue;
    }
    const fontFamilyFrame = figma.createFrame();
    fontFamilyFrame.name = fontFamily;
    fontFamilyFrame.layoutMode = "VERTICAL";
    fontFamilyFrame.counterAxisSizingMode = "AUTO";
    fontFamilyFrame.primaryAxisSizingMode = "AUTO";
    fontFamilyFrame.itemSpacing = 24;
    fontFamilyFrame.paddingTop = 16;
    fontFamilyFrame.paddingRight = 16;
    fontFamilyFrame.paddingBottom = 32;
    fontFamilyFrame.paddingLeft = 16;
    fontFamilyFrame.cornerRadius = 8;
    fontFamilyFrame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    fontFamilyFrame.minWidth = 420;
    const coverFrame = figma.createFrame();
    coverFrame.name = `${fontFamily} Cover`;
    coverFrame.layoutMode = "VERTICAL";
    coverFrame.counterAxisSizingMode = "FIXED";
    coverFrame.primaryAxisSizingMode = "FIXED";
    coverFrame.primaryAxisAlignItems = "CENTER";
    coverFrame.counterAxisAlignItems = "CENTER";
    coverFrame.itemSpacing = 4;
    coverFrame.paddingTop = 24;
    coverFrame.paddingRight = 24;
    coverFrame.paddingBottom = 24;
    coverFrame.paddingLeft = 24;
    coverFrame.cornerRadius = 4;
    coverFrame.fills = [{ type: "SOLID", color: generateRandomHSLColor() }];
    coverFrame.resize(420, 200);
    const familyNameText = figma.createText();
    familyNameText.name = `${fontFamily} Name`;
    familyNameText.fontName = currentFontStyle;
    familyNameText.characters = fontFamily;
    familyNameText.fontSize = 32;
    familyNameText.textAlignHorizontal = "CENTER";
    familyNameText.textAlignVertical = "CENTER";
    familyNameText.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    familyNameText.layoutAlign = "STRETCH";
    familyNameText.textAutoResize = "HEIGHT";
    familyNameText.lineHeight = { value: 120, unit: "PERCENT" };
    const styleCountText = figma.createText();
    styleCountText.name = `${fontFamily} Style Count`;
    styleCountText.fontName = currentFontStyle;
    styleCountText.characters = `${familyStyles.length} styles`;
    styleCountText.fontSize = 14;
    styleCountText.textAlignHorizontal = "CENTER";
    styleCountText.textAlignVertical = "CENTER";
    styleCountText.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    styleCountText.layoutAlign = "STRETCH";
    styleCountText.textAutoResize = "HEIGHT";
    coverFrame.appendChild(familyNameText);
    coverFrame.appendChild(styleCountText);
    fontFamilyFrame.appendChild(coverFrame);
    for (const style of familyStyles) {
      try {
        await figma.loadFontAsync(style.fontName);
      } catch (error) {
        console.warn(`Failed to load font: ${style.fontName.family} ${style.fontName.style}. Skipping this style.`);
        continue;
      }
      const styleFrame = figma.createFrame();
      styleFrame.name = `${fontFamily} ${style.fontName.style}`;
      styleFrame.layoutMode = "VERTICAL";
      styleFrame.counterAxisSizingMode = "AUTO";
      styleFrame.primaryAxisSizingMode = "AUTO";
      styleFrame.itemSpacing = 8;
      styleFrame.layoutAlign = "STRETCH";
      styleFrame.clipsContent = false;
      const weightText = figma.createText();
      weightText.name = `${fontFamily} ${style.fontName.style} Weight`;
      weightText.fontName = { family: "Inter", style: "Bold" };
      weightText.characters = style.fontName.style;
      weightText.fontSize = 8;
      weightText.textAlignHorizontal = "LEFT";
      weightText.textAlignVertical = "TOP";
      weightText.layoutAlign = "STRETCH";
      weightText.textAutoResize = "HEIGHT";
      weightText.setRangeFontName(0, weightText.characters.length, { family: "Inter", style: "Regular" });
      const previewText = figma.createText();
      previewText.name = `${fontFamily} ${style.fontName.style} Preview`;
      previewText.fontName = style.fontName;
      previewText.characters = inputText;
      previewText.fontSize = 32;
      previewText.lineHeight = { value: 120, unit: "PERCENT" };
      previewText.textAlignHorizontal = "LEFT";
      previewText.textAlignVertical = "TOP";
      previewText.layoutAlign = "STRETCH";
      previewText.textAutoResize = "HEIGHT";
      [weightText, previewText].forEach((text) => {
        text.setRangeLineHeight(0, text.characters.length, {
          value: 120,
          unit: "PERCENT"
        });
        text.setRangeTextStyleIdAsync(0, text.characters.length, "");
      });
      styleFrame.appendChild(weightText);
      styleFrame.appendChild(previewText);
      fontFamilyFrame.appendChild(styleFrame);
    }
    fontFrames.push(fontFamilyFrame);
  }
  let xPosition = 0;
  let yPosition = 0;
  const maxWidth = figma.viewport.bounds.width;
  for (const frame of fontFrames) {
    if (xPosition + frame.width > maxWidth) {
      xPosition = 0;
      yPosition += 50 + Math.max(...fontFrames.map((f) => f.height));
    }
    frame.x = xPosition;
    frame.y = yPosition;
    figma.currentPage.appendChild(frame);
    xPosition += frame.width + 50;
  }
  figma.viewport.scrollAndZoomIntoView(fontFrames);
}
var fonts;
var init_main = __esm({
  "src/main.ts"() {
    "use strict";
    init_lib();
    fonts = [];
    figma.ui.onmessage = async (msg) => {
      if (msg.type === "get-fonts") {
        const fontList = await figma.listAvailableFontsAsync();
        fonts = fontList;
        const fontNames = fontList.map((font) => font.fontName).filter(
          (fontName, index, self) => index === self.findIndex((t) => t.family === fontName.family)
        );
        figma.ui.postMessage({
          type: "got-fonts",
          fontNames
        });
      } else if (msg.type === "generate-preview") {
        await generatePreview(msg.inputText, msg.selectedFonts);
        figma.closePlugin();
      }
    };
  }
});

// <stdin>
var modules = { "src/main.ts--default": (init_main(), __toCommonJS(main_exports))["default"] };
var commandId = true ? "src/main.ts--default" : figma.command;
modules[commandId]();
