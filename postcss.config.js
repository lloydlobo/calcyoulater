module.exports = {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

// One important thing to note about postcss-import is that it strictly adheres to the CSS spec and disallows @import statements anywhere except at the very top of a file.
// If you rather use postcss-nesting (which is based on the work-in-progress CSS Nesting specification), first install the plugin
// npm install -D postcss-nesting
// By default, it uses the postcss-nested plugin under the hood, which uses a Sass-like syntax and is the plugin that powers nesting support in the Tailwind CSS plugin API.
