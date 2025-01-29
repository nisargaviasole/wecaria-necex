import adapter from '@sveltejs/adapter-node';

export default {
  kit: {
    adapter: adapter(),
    alias: {
      $lib: './src/lib',
    }
  },
  preprocess: {}  // Or remove this line if not needed
};
