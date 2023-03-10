import { defineConfig } from 'windicss/helpers';
import formsPlugin from 'windicss/plugin/forms';
import aspectRatioPlugin from 'windicss/plugin/aspect-ratio';

const palette = {
  craterBrown: '#442822',
  muesli: '#AD8666',
  justRight: '#EACEAF',
  oldGold: '#D0A933',
  thunderbird: '#C72D22',
  white: '#FFFFFF',
};

export default defineConfig({
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      palette: palette,
      foreground: palette.justRight,
      background: palette.craterBrown,
      highlight: palette.oldGold,
      text: palette.white,
    },
    extend: {},
  },
  plugins: [formsPlugin, aspectRatioPlugin],
});
