var Cookie = {
  set: function(name, value, daysToExpire) {
    var expire = '';
    if (daysToExpire != undefined) {
      var d = new Date();
      d.setTime(d.getTime() + (86400000 * parseFloat(daysToExpire)));
      expire = '; expires=' + d.toGMTString();
    }
//    return (document.cookie = escape(name) + '=' + escape(value || '') + expire);
    return (document.cookie = escape(name) + '=' + (value || '') + expire + '; path=/');
  },
  get: function(name) {
    var cookie = document.cookie.match(new RegExp('(^|;)\\s*' + escape(name) + '=([^;\\s]*)'));
    return (cookie ? unescape(cookie[2]) : null);
  },
  erase: function(name) {
    var cookie = Cookie.get(name) || true;
    Cookie.set(name, '', -1);
    return cookie;
  },
  accept: function() {
    if (typeof navigator.cookieEnabled == 'boolean') {
      return navigator.cookieEnabled;
    }
    Cookie.set('_test', '1');
    return (Cookie.erase('_test') === '1');
  }
};

function adjustView(which) {
    if (which=='tcl') {
        $$('.tcl').each(function(item)         { item.addClassName('tclplain');     item.removeClassName('tcl')        })
        $$('.tclhidden').each(function(item)   { item.addClassName('tclplain');     item.removeClassName('tclhidden')  })
        $$('.ruby').each(function(item)        { item.addClassName('rubyhidden');   item.removeClassName('ruby')       })
        $$('.rubyplain').each(function(item)   { item.addClassName('rubyhidden');   item.removeClassName('rubyplain')  })
        $$('.perl').each(function(item)        { item.addClassName('perlhidden');   item.removeClassName('perl')       })
        $$('.perlplain').each(function(item)   { item.addClassName('perlhidden');   item.removeClassName('perlplain')  })
        $$('.python').each(function(item)      { item.addClassName('pythonhidden'); item.removeClassName('python')       })
        $$('.pythonplain').each(function(item) { item.addClassName('pythonhidden'); item.removeClassName('pythonplain')  })
        Cookie.set('tlang', 'tcl');
    } else if (which=='ruby') {
        $$('.ruby').each(function(item)        { item.addClassName('rubyplain');    item.removeClassName('ruby')       })
        $$('.rubyhidden').each(function(item)  { item.addClassName('rubyplain');    item.removeClassName('rubyhidden') })
        $$('.tcl').each(function(item)         { item.addClassName('tclhidden');    item.removeClassName('tcl')        })
        $$('.tclplain').each(function(item)    { item.addClassName('tclhidden');    item.removeClassName('tclplain')   })
        $$('.perl').each(function(item)        { item.addClassName('perlhidden');   item.removeClassName('perl')       })
        $$('.perlplain').each(function(item)   { item.addClassName('perlhidden');   item.removeClassName('perlplain')  })
        $$('.python').each(function(item)      { item.addClassName('pythonhidden'); item.removeClassName('python')       })
        $$('.pythonplain').each(function(item) { item.addClassName('pythonhidden'); item.removeClassName('pythonplain')  })
        Cookie.set('tlang', 'ruby');
    } else if (which=='perl') {
        $$('.perl').each(function(item)        { item.addClassName('perlplain');    item.removeClassName('perl')       })
        $$('.perlhidden').each(function(item)  { item.addClassName('perlplain');    item.removeClassName('perlhidden') })
        $$('.tcl').each(function(item)         { item.addClassName('tclhidden');    item.removeClassName('tcl')        })
        $$('.tclplain').each(function(item)    { item.addClassName('tclhidden');    item.removeClassName('tclplain')   })
        $$('.ruby').each(function(item)        { item.addClassName('rubyhidden');   item.removeClassName('ruby')       })
        $$('.rubyplain').each(function(item)   { item.addClassName('rubyhidden');   item.removeClassName('rubyplain')  })
        $$('.python').each(function(item)      { item.addClassName('pythonhidden'); item.removeClassName('python')       })
        $$('.pythonplain').each(function(item) { item.addClassName('pythonhidden'); item.removeClassName('pythonplain')  })
        Cookie.set('tlang', 'perl');
    } else if (which=='python') {
        $$('.python').each(function(item)       { item.addClassName('pythonplain'); item.removeClassName('python')       })
        $$('.pythonhidden').each(function(item) { item.addClassName('pythonplain'); item.removeClassName('pythonhidden') })
        $$('.tcl').each(function(item)         { item.addClassName('tclhidden');    item.removeClassName('tcl')        })
        $$('.tclplain').each(function(item)    { item.addClassName('tclhidden');    item.removeClassName('tclplain')   })
        $$('.ruby').each(function(item)        { item.addClassName('rubyhidden');   item.removeClassName('ruby')       })
        $$('.rubyplain').each(function(item)   { item.addClassName('rubyhidden');   item.removeClassName('rubyplain')  })
        $$('.perl').each(function(item)        { item.addClassName('perlhidden');   item.removeClassName('perl')       })
        $$('.perlplain').each(function(item)   { item.addClassName('perlhidden');   item.removeClassName('perlplain')  })
        Cookie.set('tlang', 'python');
    } else {
        $$('.tclplain').each(function(item)    { item.addClassName('tcl');        item.removeClassName('tclplain')   })
        $$('.tclhidden').each(function(item)   { item.addClassName('tcl');        item.removeClassName('tclhidden')  })
        $$('.rubyplain').each(function(item)   { item.addClassName('ruby');       item.removeClassName('rubyplain')  })
        $$('.rubyhidden').each(function(item)  { item.addClassName('ruby');       item.removeClassName('rubyhidden') })
        $$('.perlplain').each(function(item)   { item.addClassName('perl');       item.removeClassName('perlplain')  })
        $$('.perlhidden').each(function(item)  { item.addClassName('perl');       item.removeClassName('perlhidden') })
        $$('.pythonplain').each(function(item)   { item.addClassName('python');   item.removeClassName('pythonplain')  })
        $$('.pythonhidden').each(function(item)  { item.addClassName('python');   item.removeClassName('pythonhidden') })
        Cookie.erase('tlang');
    }
}

function setDefaultLang() {
    var l = Cookie.get('tlang');
    if (l!=null) {$('languageselect').value = l; adjustView(l);}
}

