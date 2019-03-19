/+  *server
/=  index
  /:  /===/app/landscape/index  /!noun/
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
/=  inbox
  /:  /===/app/landscape/inbox  /!noun/
/=  stream
  /:  /===/app/landscape/stream  /!noun/
/=  coll-elem
  /:  /===/app/landscape/collections/elem  /!noun/
/=  coll-new
  /:  /===/app/landscape/collections/new   /!noun/
/=  coll-edit
  /:  /===/app/landscape/collections/edit  /!noun/
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
      =/  index-html=octs  (as-octs:mimes:html (crip (en-xml:html (index inbox))))
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
      [%profile @t *]
        =/  profile-html=octs  (as-octs:mimes:html (crip (en-xml:html (index (profile i.t.t.site.request-line)))))
        :_  this
        :~  ^-  move
            :-  ost.bol
            :*  %http-response
                [%start [200 ['content-type' 'text/html']~] [~ profile-html] %.y]
            ==
        ==
      [%stream *]
      =/  stream-html=octs  (as-octs:mimes:html (crip (en-xml:html (index stream))))
      :_  this
      :~  ^-  move
          :-  ost.bol
          :*  %http-response
              [%start [200 ['content-type' 'text/html']~] [~ stream-html] %.y]
          ==
      ==
      [%collections @t @t *]
      =/  shp/@p  (slav %p i.t.t.site.request-line)
      =/  col/@da   (slav %da i.t.t.t.site.request-line)
      =*  tal  t.t.t.t.site.request-line
      ~&  ship+shp
      ~&  col+col
      ~&  tal+tal
      ?:  ?=(~ tal)
        ~&  %toplevel^col
        :: top level collection
        =/  top-html=octs  (as-octs:mimes:html (crip (en-xml:html (index (coll-elem shp col ~)))))
        :_  this
        :~  ^-  move
            :-  ost.bol
            :*  %http-response
                [%start [200 ['content-type' 'text/html']~] [~ top-html] %.y]
            ==
        ==
      ?:  ?=([@t ~] tal)
        :: make a new post, or view an old one
        ~&  new-or-old+col
        ?:  =(-.tal 'new')
          ::  make a new post
          ::
          ~&  'new'
          =/  new-html=octs  (as-octs:mimes:html (crip (en-xml:html (index (coll-new shp col)))))
          :_  this
          :~  ^-  move
              :-  ost.bol
              :*  %http-response
                  [%start [200 ['content-type' 'text/html']~] [~ new-html] %.y]
              ==
          ==
        ::  view a post
        ::
        =/  pos=@da  (slav %da i.tal)
        =/  post-html=octs  (as-octs:mimes:html (crip (en-xml:html (index (coll-elem shp col `pos)))))
        :_  this
        :~  ^-  move
            :-  ost.bol
            :*  %http-response
                [%start [200 ['content-type' 'text/html']~] [~ post-html] %.y]
            ==
        ==
      ::  edit a post
      ::
      ?:  ?=([@t @t ~] tal)
        ~&  edit+tal
        ?:  =(+<.tal 'edit')

          =/  pos=@da  (slav %da i.tal)
          =/  ver=cass:clay  .^(cass:clay %cw /===)
          ~&  pos+pos
          ~&  ver+ver
          =/  dat=@t  'asdf'
          ::=/  dat=@t  .^(@t %cx /(scot %p our.bol)/home/(scot %ud ud.ver)/web/collections/(scot %da col)/(scot %da pos))
          ~&  edit-dat+dat
          =/  edit-html=octs  (as-octs:mimes:html (crip (en-xml:html (index (coll-edit shp col pos dat)))))
          :: edit a post
          :_  this
          :~  ^-  move
              :-  ost.bol
              :*  %http-response
                  [%start [200 ['content-type' 'text/html']~] [~ edit-html] %.y]
              ==
          ==
        [~ this]
      [~ this]
    ==
--
