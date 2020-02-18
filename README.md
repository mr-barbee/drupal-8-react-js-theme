# Drupal 8 ReactJS Theme

## Semi-Headless drupal
Drupal is still loaded we just add a class in the body template so that it would load on all of the custom pages that i have built out. In the future i do plan on making this completely headless but since its a theme form it will still need Drupal to activate it.

Within a preprocess_html hook we add some variables to the Drupal settings the would pass over to the frontend
to determine which pages to show the theme and some settings to determine maintenance mode.

```
// Add the intro video and logo add assessts to JS.
$variables['#attached']['drupalSettings']['logo']['url']['src'] = theme_get_setting('logo.url');
$variables['#attached']['drupalSettings']['logo']['name']['src'] = $config->get('name');
// See if we should display the maintenance messages.
$variables['#attached']['drupalSettings']['maintenanceMode'] = $maintenance_mode;
$variables['#attached']['drupalSettings']['disableStore'] = $disable_store;

if (!empty(theme_get_setting('footer_image')[0])) {
  $footer_file = \Drupal\file\Entity\File::load(theme_get_setting('footer_image')[0]);
  if (gettype($footer_file) == 'object') {
    $variables['#attached']['drupalSettings']['footerImage']['src'] = file_create_url($footer_file->getFileUri());
  }
}
$variables['#attached']['drupalSettings']['menuItems']['src'] = $menu;
```

I set a page variable to determine if the app class should be applied to the page. I only apply it if the current page is listed in the menu or if the user is currently on the product or checkout pages. 
The ```grandera-application``` id determines if we should load the app on that page.

```
{% set page_container = show_application ? 'grandera-application' : 'normal-site' %}
<div id="{{ page_container }}">
{# Navbar #}
{% if page.navigation or page.navigation_collapsible %}
  {% block navbar %}
```

## Gulp
I utilized gulp as my task manger for this project.
