/+  *server
/=  index
  /:  /===/app/landscape/main  /!noun/
/=  script
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/landscape/js/index  /js/
/=  style
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/landscape/css/index  /css/
/=  profile
  /:  /===/app/landscape/profile  /!noun/
::
|%
:: +move: output effect
::
+$  move  [bone card]
:: +card: output effect payload
::
+$  card
  $%  [%poke wire dock poke]
      [%http-response =http-event:http]

  ==
+$  poke
  $%  [%modulo-bind app=term]
      [%modulo-unbind app=term]
  ==
--
::
|_  [bol=bowl:gall sta=@t]
::
++  this  .
::
++  poke-noun
  |=  asd=?(%bind %unbind)
  ^-  (quip move _this)
  :_  this
  ?:  =(%bind asd)
    [ost.bol %poke / [our.bol %modulo] `poke`[%modulo-bind %landscape]]~
  [ost.bol %poke / [our.bol %modulo] `poke`[%modulo-unbind %landscape]]~
++  prep
  |=  old=(unit @t)
  ^-  (quip move _this)
  ~&  %prep
  :-  [ost.bol %poke / [our.bol %modulo] [%modulo-bind %landscape]]~
  ?~  old
    this
  this(sta u.old)
::
++  poke-handle-http-request
  %-  (require-authorization ost.bol move this)
  |=  =inbound-request:http-server
  ^-  (quip move _this)
  =+  request-line=(parse-request-line url.request.inbound-request)
  =+  back-path=(flop site.request-line)
  =/  name=@t
    ?~  back-path
      'World'
    i.back-path
  ?<  ?=(~ site.request-line)
  ?+  t.site.request-line
    =/  index-html=octs  (as-octs:mimes:html (crip (en-xml:html (index ;div;))))
    :_  this
    :~  ^-  move
        :-  ost.bol
        :*  %http-response
            [%start [200 ['content-type' 'text/html']~] [~ index-html] %.y]
        ==
    ==
    [%css *]
      :_  this
      :~  ^-  move
          :-  ost.bol
          :*  %http-response
              [%start [200 ['content-type' 'text/css']~] [~ style] %.y]
          ==
      ==
    [%js *]
      :_  this
      :~  ^-  move
          :-  ost.bol
          :*  %http-response
              [%start [200 ['content-type' 'application/javascript']~] [~ script] %.y]
          ==
      ==
    [%profile who=@t *]
      =/  profile-html=octs  (as-octs:mimes:html (crip (en-xml:html (index (profile i.t.t.site.request-line)))))
      :_  this
      :~  ^-  move
          :-  ost.bol
          :*  %http-response
              [%start [200 ['content-type' 'text/html']~] [~ profile-html] %.y]
          ==
      ==
    ==
--
