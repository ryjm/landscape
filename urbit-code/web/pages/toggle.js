document.toggleDisplay = function() {
  var id1 = 'show';
  var id2 = 'edit';
  var isDisplayed = function(id) {
    return document.getElementById(id).style.display != 'none';
  }
  if (isDisplayed(id1)) {
    window.location.href = window.location.href + '#' + id2
    document.getElementById(id1).style.display = 'none';
    document.getElementById(id2).style.display = 'inherit';
  } else {
    window.location.href = window.location.href + '#' + id1
    document.getElementById(id1).style.display = 'none';
    document.getElementById(id1).style.display = 'inherit';
    document.getElementById(id2).style.display = 'none';
  }
};

document.getElementById('edit-btn').onclick = document.toggleDisplay;
