/-  collections
/=  gas  /$  fuel:html
/=  configs  /:  /===/web/collections
            /^  (map knot config:collections)  /_  /collections-config/
=/  config  %-  %~  get 
                    by 
                    configs
                ==
            %+  fall
              %-  %~  get 
                      by 
                      qix.gas 
                  ==
              %coll
            ''
^-  manx
;div
  ;div.row.coll-title
    {(trip desc:(need config))} /
  ==
  :: TODO pass text as prop?
  ;div(data-component "TopicCreatePage");
==
