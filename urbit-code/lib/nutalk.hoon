|=  inner=manx  ^-  manx
;html
  ;head
    ;title: Nutalk
    ;meta(charset "utf-8");
    ;meta(name "viewport", content "width=device-width, initial-scale=1, shrink-to-fit=no");
    ;link(rel "shortcut icon", href "talk.png");      :: doesn't work
    ;link(rel "stylesheet", href "/~~/pages/nutalk/css/index.css");
  ==
  ;body
    ;div
      ;div.menu-main
        ;a/"menu"
          ;div.panini;
        ==
        ;div.liang;
      ==
      ;div.container.breadcrumbs-main
        ;div.row
          ;div.col-sm-offset-1
            ;h3.underline.text-gray
              ;a/"": Inbox
            ==
          ==
        ==
      ==
      ;div.main-body
        ;ul.nav-main
          ;li
            ;a/"": Index
          ==
          ;li
            ;a/"show": Show
          ==
          ;li
            ;a/"edit": Edit
          ==
          ;li
            ;a/"menu": Menu
          ==
        ==

        ;div#root
          ;+  inner
        ==
      ==
    ==

    ;script@"/~~/pages/nutalk/js/app.js";
    ;script@"/~~/pages/nutalk/js/main.js";
  ==
==
