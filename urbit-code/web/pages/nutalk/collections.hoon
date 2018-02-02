:: An index of all own collections
/-  collections
/+  old-zuse
/=  cols  /:  /===/web/collections
             /^  (map knot config:collections)  /_  /collections-config/
^-  manx
=,  old-zuse
;div(class "container")
  ;*  %+  turn
        %+  sort
          ~(tap by cols)
        |=  [a=(pair knot config:collections) b=(pair knot config:collections)]
        (gth (unt (slav %da p.a)) (unt (slav %da p.b)))
      |=  [t=knot con=config:collections]
      ;div(class "row")
        ;div(class "da row col-md-12")
          ;a(href "/~~/collections/{(trip t)}.hoon"): {(trip t)}
        ==
        ;div(class "collection-title row col-md-12")
          ;h1: {(trip desc.con)}
        ==
      ==
==

