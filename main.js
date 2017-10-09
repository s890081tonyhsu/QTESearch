var dataw = [], datac = [];
//var gs = "https://spreadsheets.google.com/feeds/list/1StkcQvE-2XfEPZCeV2XWdzXqqs-Ib1ZgU98tzdFKzbI/1/public/values?alt=json";
var gsw = "https://spreadsheets.google.com/feeds/list/1StkcQvE-2XfEPZCeV2XWdzXqqs-Ib1ZgU98tzdFKzbI/1/public/values?alt=json";
var gsc = "https://spreadsheets.google.com/feeds/list/1StkcQvE-2XfEPZCeV2XWdzXqqs-Ib1ZgU98tzdFKzbI/2/public/values?alt=json";
$.ajax(gsw)
  .done(function(r){
    r.feed.entry.forEach(function(s){
      var q = s['gsx$問題']['$t'].toLowerCase();
      var a = s['gsx$答え']['$t'].split('');
      dataw.push({q: q, a: a});
    });
    $('#wquesPart').on('keyup', wkeyupCallback);
    $('#wplayerPos').on('change', wkeyupCallback);
  })
  .fail(function(e){
    console.error(e);
  });

$.ajax(gsc)
  .done(function(r){
    r.feed.entry.forEach(function(s){
      var q = s['gsx$問題答え']['$t'].toLowerCase();
      var a = s['gsx$答え']['$t'].split('／');
      datac.push({q: q, a: a});
    });
    $('#cquesPart').on('keyup', ckeyupCallback);
    $('#cplayerPos').on('change', ckeyupCallback);
  })
  .fail(function(e){
    console.error(e.responseJSON);
  });

function search4Result(val, data){
  var i, j, len, res;
  try {
    if (val.split(" ").length > 1) {
      val = val.split(" ");
      val = _.uniqBy(val);
      for(i = j = 0, len = val.length; j < len; i = ++j) {
        var v = val[i];
        if(v === "") delete[i];
      }
      res = _.filter(data, function(o){
        var f = true;
        val.forEach(function(v){
          if(o.q.indexOf(v) === -1) f = false;
        })
        return f;
      });
    } else {
      res = _.filter(dataw, function(o){
        return o.q.indexOf(val) !== -1;
      });
      return res;
    }
  }catch(error){
    console.error(error);
    return;
  }
}

function wkeyupCallback() {
  var val, i, j, len, res, pos = parseInt($('#wplayerPos').val());
  val = $('#wquesPart').val();
  val = val.replace(/\s\s+/g, ' ');
  $('#wresList').html('');
  if(val.length < 2) return;
  val = val.toLowerCase();

  res = search4Result(val, dataw);
  if(res == null) return;
  html = '';
  res.forEach(function(r){
    var q = r.q, a = '';
    for(var i = 0; i < 5; i++){
      if(i == pos) a += '<span>' + r.a[i] + '</span>';
      else a += r.a[i];
    }
    html += '<tr><td>' + a + '</td><td>' + q + '</td></tr>';
  });
  $('#wresList').append(html);
}
function ckeyupCallback() {
  var val, i, j, len, res;
  val = $('#wquesPart').val();
  val = val.replace(/\s\s+/g, ' ');
  $('#cresList').html('');
  if(val.length < 2) return;
  val = val.toLowerCase();

  res = search4Result(val, datac);
  if(res == null) return;
  html = '';
  res.forEach(function(r){
    var q = r.q, a = r.a.join('<br>');
    html += '<tr><td>' + a + '</td><td>' + q + '</td></tr>';
  });
  $('#cresList').append(html);
}
