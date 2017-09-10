var data = [];
//var gs = "https://spreadsheets.google.com/feeds/list/1StkcQvE-2XfEPZCeV2XWdzXqqs-Ib1ZgU98tzdFKzbI/1/public/values?alt=json";
var yql = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20htmlstring%20where%20url%3D'http%3A%2F%2Fquiz-wiz.com%2Fdatabase%2Fquiz5%2F%3Fdisp%3D10000%26raid%3Donly_raid'%20and%20xpath%3D'%2F%2Ftable'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
$.ajax({
  url: yql,
  success: function(r){
    console.log(r);
    var $table = $(r.query.results.result)
    var table = $table.tableToJSON({onlyColumns: [2,3], ignoreHiddenRows: false});
    console.log(table);
    table.forEach(function(s){
      var q = s['問題'].toLowerCase();
      var a = s['答え'].split('');
      data.push({q: q, a: a});
    });
    console.log(data);
    $('#quesPart').on('keyup', keyupCallback);
    $('#playerPos').on('change', keyupCallback);
  }
});

function keyupCallback() {
  var val, i, j, len, res, pos = parseInt($('#playerPos').val());
  val = $('#quesPart').val();
  val = val.replace(/\s\s+/g, ' ');
  $('#resList').html('');
  if(val.length < 2) return;
  val = val.toLowerCase();

  try {
    if (val.split(" ").length > 1) {
      val = val.split(" ");
      val = _.uniqBy(val);
      for (i = j = 0, len = val.length; j < len; i = ++j) {
        v = val[i];
        if (v === "") {
          delete val[i];
        }
      }
      res = _.filter(data, function(o){
        var f = true;
        val.forEach(function(v){
          if(o.q.indexOf(v) === -1) f = false;
        })
        return f;
      });
    } else {
      res = _.filter(data, function(o){
        return o.q.indexOf(val) !== -1;
      });
    }
  } catch (error) {
    console.error(error);
    return;
  }
  console.log(res);
  console.log(pos);
  html = '';
  res.forEach(function(r){
    var q = r.q, a = '';
    for(var i = 0; i < 5; i++){
      if(i == pos) a += '<span>' + r.a[i] + '</span>';
      else a += r.a[i];
    }
    html += '<tr><td>' + a + '</td><td>' + q + '</td></tr>';
  });
  $('#resList').append(html);
}