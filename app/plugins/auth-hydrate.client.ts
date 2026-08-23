export default defineNuxtPlugin({
  name: 'auth-cookie-hydration',
  dependsOn: ['pinia'],
  hooks: {
    'app:mounted'() {
      // Prerendered public HTML is anonymous. Updating auth before Vue mounts
      // changes the header/page tree during hydration and can leave DOM event
      // listeners unattached. Protected routes still sync in their middleware.
      useAuthStore().syncTokensFromCookies();
    }
  }
});
