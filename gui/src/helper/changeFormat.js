const changeFormat = {};

changeFormat.toNumber = (n) => {
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

changeFormat.toInt = (n) => {
  n = n.toString();
  if (n !== undefined && n !== "") {
    return parseFloat(n.replace(/,/g, "").replace("$", "")).toFixed(2);
  } else {
    return n;
  }
};

changeFormat.inputMoney = (e) => {
  const { value } = e.target;

  let valInput = value;

  if (valInput === "") {
    return;
  }

  let originalLn = value.length;

  let caret_pos = e.target.selectionStart;

  if (valInput.indexOf(".") >= 0) {
    const decimalPos = valInput.indexOf(".");

    let leftSide = valInput.substring(0, decimalPos);
    let rightSide = valInput.substring(decimalPos);

    leftSide = changeFormat.toNumber(leftSide);
    rightSide = changeFormat.toNumber(rightSide);

    if (e.type === "blur") {
      rightSide += "00";
    }

    rightSide = rightSide.substring(0, 2);

    valInput = "$" + leftSide + "." + rightSide;
  } else {
    valInput = changeFormat.toNumber(valInput);
    valInput = "$" + valInput;

    if (e.type === "blur") {
      valInput += ".00";
    }
  }

  let updateLn = valInput.length;
  caret_pos = updateLn - originalLn + caret_pos;

  e.target.setSelectionRange(caret_pos, caret_pos);

  return valInput;
};

changeFormat.numberToString = (numb) => {
  numb = parseFloat(numb).toFixed(2);
  let valInput = numb.toString();

  if (valInput === "") {
    return;
  }

  if (valInput.indexOf(".") >= 0) {
    const decimalPos = valInput.indexOf(".");

    let leftSide = valInput.substring(0, decimalPos);
    let rightSide = valInput.substring(decimalPos);

    leftSide = changeFormat.toNumber(leftSide);
    rightSide = changeFormat.toNumber(rightSide);

    rightSide += "00";

    rightSide = rightSide.substring(0, 2);

    valInput = "$" + leftSide + "." + rightSide;
  } else {
    valInput = changeFormat.toNumber(valInput);
    valInput = "$" + valInput;

    valInput += ".00";
  }

  return valInput;
};

changeFormat.toDate = (date) => {
  date = new Date(date);

  let datemnt = date.getMonth();
  let dateday = date.getDate();
  datemnt = datemnt.toString();
  dateday = dateday.toString();

  if (datemnt.length !== 1) {
    if (dateday.length !== 1) {
      return (
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      );
    } else {
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        ("0" + date.getDate())
      );
    }
  } else {
    if (dateday.length !== 1) {
      return (
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)) +
        "-" +
        date.getDate()
      );
    } else {
      return (
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)) +
        "-" +
        ("0" + date.getDate())
      );
    }
  }
};

changeFormat.toDouble = (strnum) => {
  let aux = strnum.toString();
  return aux.replace("$", "").replace(",", "");
};

module.exports = changeFormat;
