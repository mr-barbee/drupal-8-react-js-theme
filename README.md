# Drupal 8 ReactJS Theme

## Build Folder File Structure
    .
    ├── ...
    ├── build                                  # The Root folder for the ReactJS application.
    │  ├── Components                          # Site-wide Components accessible to the entire project.
    |  │  ├── SiteComponent
    |  |  |  ├── SubComponent                  # Each Component can have nested components that should ONLY be accessible to parent  
    |  |  |  |   └── index.js                  # component and its sub components.
    |  |  |  └── index.js                     
    |  |  └── ...  
    │  ├── Scenes
    |  |  ├── Page                             # These are the different pages of the site.
    |  |  │  └── Components                    # Each page can have its own nested component accessible to that page only.
    |  |  |  |  └── PageComponent 
    |  |  |  |  └──└── index.js  
    |  |  |  └── index.js 
    |  │  └── ...                           
    │  ├── Services
    |  |  └── AppService                       # A utility service helper classes for interacting with external API.
    |  |  |  └── index.js 
    |  |  └── ...
    │  ├── app.js                              # The main app file that pull in all of the pages.
    │  └── index.js                            # This is the root index file that loads and renders the app.
    └── ...
The purpose of this structure was to keep the files organized while keeping in mind that the site will grow and utilize more pages and sub components.


## Semi-Headless drupal
Drupal is still loaded we just add a class in the body template so that it would load on all of the custom pages that I have built out.
Therfore I can take advantage of the drupal session and page variables. In the future I do plan on making this completely headless but since its a theme form it will still need Drupal to activate it. 

Within a preprocess_html hook we add some variables to the Drupal settings the would pass over to the frontend
to determine which pages to show the theme and some settings to determine maintenance mode.

```php
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

```php
{% set page_container = show_application ? 'grandera-application' : 'normal-site' %}
<div id="{{ page_container }}">
{# Navbar #}
{% if page.navigation or page.navigation_collapsible %}
  {% block navbar %}
```

## Gulp
I utilized gulp as my task manger for this project.
