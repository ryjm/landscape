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
  ;div.container(urb-devices "")
    ;div.row
      ;div.flex-col-2;
      ;div.flex-col-x
        ;button.btn.btn-primary(type "button"): Connect device
        :: ;a(href "javascript:(function(){document.querySelectorAll('[urb-devices]')[0].classList.add('hide'); document.querySelectorAll('[urb-devices]')[0].classList.remove('hide');})()"): Connect device
      ==
    ==
  ==
  ;div.container.hide(urb-qr "")
    ;div.row
      ;div.flex-col-2;
      ;div.flex-col-x
        ;button.btn.btn-primary(type "button"): Done
        :: ;a(href "javascript:(function(){ document.querySelectorAll('[urb-devices]')[0].classList.add('hide'); document.querySelectorAll('[urb-devices]')[0].classList.remove('hide'); })()")
        :: ==
      ==
    ==
  ==
==
