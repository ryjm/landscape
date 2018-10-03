/+  collections, colls
/=  gas  /$  fuel:html
::/=  all-colls  /:  /===/web/collections
::               /collection-web-item/
|%
  :: is this collection on the profile?
  ++  is-pro
  |=  col=collection:collections
  visible.meta.col
--
^-  manx
;div
  ;input(type "hidden", name "urb-metadata", urb-structure-type "header-profile", urb-owner "{(scow %p p.bem.gas)}");
  ;div.container
    ;div.row
      ;div.flex-col-2;
      ;div.flex-col-x
        ;h2: Well hello
        ;span: eyeyey
        :: ;a(href "javascript:(function()&#123;document.querySelectorAll('[urb-devices]')[0].classList.add('hide'); document.querySelectorAll('[urb-devices]')[0].classList.remove('hide');&#125;)()"): Hello
        ;a(href "javascript:(function() consolelog(5) )()"): Hello
          :: ;button(type "button").btn.btn-primary: Connect device
        ==
      ==
    ==
  ==
  :: ;div(urb-qr).container.hide
  ::   ;div.row
  ::     ;div.flex-col-2;
  ::     ;div.flex-col-x
  ::       ;a(href "javascript:(function(){ document.querySelectorAll('[urb-devices]')[0].classList.add('hide'); document.querySelectorAll('[urb-devices]')[0].classList.remove('hide'); })()")
  ::         ;button(type "button").btn.btn-primary: Done
  ::       ==
  ::     ==
  ::   ==
  :: ==
==
