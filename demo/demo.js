let mockdata = [
  {
    s_sn: "35",
    cnname: "邱小甘",
    enname: "Peter",
    sex: "0",
    phone: "0912345678",
    email: "test@test.gamil.com",
  },
  {
    s_sn: "49",
    cnname: "蔡凡昕",
    enname: "Allen",
    sex: "0",
    phone: "0912345678",
    email: "test@test.gamil.com",
  },
  {
    s_sn: "50",
    cnname: "趙雪瑜",
    enname: "Sharon",
    sex: "0",
    phone: "0912345678",
    email: "test@test.gamil.com",
  },
  {
    s_sn: "51",
    cnname: "賴佳蓉",
    enname: "Yoki",
    sex: "1",
    phone: "0912345678",
    email: "test@test.gamil.com",
  },
];

// 錯誤驗證
const isValidPhone = (phone) => {
  // 中文、英文、手機號碼、電子信箱 正則表達式
  let mobileRegex = /^[0]{1}[9]{1}[0-9]{4}[0-9]{4}$/;
  return mobileRegex.test(phone);
};

const isValidEmail = (email) => {
  let emailRegex =
    /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return emailRegex.test(email);
};

$(document).ready(function () {
  // alert('abc');
  let url = "ajax/ajaxCard";
  let ajaxobj = new AjaxObject(url, "json");
  ajaxobj.getall();

  // 初始化 Tooltip
  let tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );

  $.map(tooltipTriggerList, function (el) {
    return new bootstrap.Tooltip(el);
  });

  // 初始化 popover
  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // hover 效果
  $("#cardtable td").hover(
    function () {
      console.log("td this", this);
      let cellindex = $(this).index() + 1;
      console.log("cellindex", cellindex);
      $(`#cardtable td:nth-child(${cellindex})`).addClass("focus");
      $(this).removeClass("focus");
    },
    function () {
      let cellindex = $(this).index() + 1;
      $(`#cardtable td:nth-child(${cellindex})`).removeClass("focus");
    }
  );

  // 新增按鈕
  $("#addbutton").click(function () {
    $("#addModal").modal("show");
    $("#addModal").on("click", "#addModal-submit", (e) => {
      e.stopImmediatePropagation();
      e.preventDefault(); // avoid to execute the actual submit of the form.
      let url = "ajax/ajaxCard";
      let cnname = $("#addcnname").val();
      let enname = $("#addenname").val();
      let sex = $('input:radio:checked[name="addsex"]').val();
      let phone = $("#addphone").val();
      let email = $("#addemail").val();
      if (
        !cnname ||
        !sex ||
        !phone ||
        !email ||
        !isValidPhone(phone) ||
        !isValidEmail(email)
      ) {
        if (!cnname) {
          $("#addcnnameErrormessage").text("這裡忘記填囉");
        } else {
          $("#addcnnameErrormessage").text("");
        }
        if (!sex) {
          $("#addsexErrormessage").text("這裡忘記填囉");
        } else {
          $("#addsexErrormessage").text("");
        }
        if (!phone) {
          $("#addPhoneErrorMessage").text("這裡忘記填囉");
        } else if (!isValidPhone(phone)) {
          $("#addPhoneErrorMessage").text(
            "格式錯誤，手機號碼應為 10 碼數字並 09 開頭"
          );
        } else {
          $("#addPhoneErrorMessage").text("");
        }
        if (!email) {
          $("#addEmailErrorMessage").text("這裡忘記填囉");
        } else if (!isValidEmail(email)) {
          $("#addEmailErrorMessage").text("格式錯誤");
        } else {
          $("#addEmailErrorMessage").text("");
        }
        return;
      }
      let ssn = mockdata[mockdata.length - 1].s_sn;
      let s_sn = `${parseInt(ssn) + 1}`;
      let ajaxobj = new AjaxObject(url, "json");
      ajaxobj.add({
        s_sn,
        cnname,
        enname,
        sex,
        phone,
        email,
      });
      $("#addForm")[0].reset();
      $("#addcnnameErrormessage").text("");
      $("#addsexErrormessage").text("");
      $("#addPhoneErrorMessage").text("");
      $("#addEmailErrorMessage").text("");
    });

    $('input:radio:checked[name="addsex"]').on(
      "click",
      (e) => {
        e.stopPropagation();
      },
      false
    );

    $("#addModal-reset").on("click", function () {
      $("#addForm")[0].reset();
      $("#addcnnameErrormessage").text("");
      $("#addsexErrormessage").text("");
      $("#addPhoneErrorMessage").text("");
      $("#addEmailErrorMessage").text("");
    });
  });

  // 搜尋按鈕
  $("#searchbutton").click(function () {
    $("#dialog-searchconfirm").dialog({
      resizable: true,
      height: $(window).height() * 0.4, // dialog視窗度
      width: $(window).width() * 0.4,
      modal: true,
      buttons: {
        // 自訂button名稱
        搜尋: function (e) {
          let url = "ajax/ajaxCard";
          // let data = $("#searchform").serialize();
          let cnname = $("#secnname").val();
          let enname = $("#seenname").val();
          let sex = $('input:radio:checked[name="addsex"]').val();
          let ajaxobj = new AjaxObject(url, "json");
          ajaxobj.cnname = cnname;
          ajaxobj.enname = enname;
          ajaxobj.sex = sex;
          ajaxobj.search();

          e.preventDefault(); // avoid to execute the actual submit of the form.
        },
        重新填寫: function () {
          $("#searchform")[0].reset();
        },
        取消: function () {
          $(this).dialog("close");
        },
      },
    });
  });
  
  // 修改鈕
  $("#cardtable").on("click", ".modifybutton", function () {
    let id = $(this).attr("id").substring(12);
    console.log("id", id)
    let ajaxobj = new AjaxObject(url, "json");
    ajaxobj.modify_get(id);
  });

  // 刪除
  $("#cardtable").on("click", ".deletebutton", function () {
    $("#deleteModal").modal("show");
    let deleteid = $(this).attr("id").substring(12);

    $("#deleteModal-submit").on("click", function () {
      let url = "ajax/ajaxCard";
      let ajaxobj = new AjaxObject(url, "json");
      // ajaxobj.id = deleteid;
      ajaxobj.delete(deleteid);
      $("#deleteModal").modal("hide");
    });
  });

  // 自適應視窗
  $(window).resize(function () {
    let wWidth = $(window).width();
    let dWidth = wWidth * 0.4;
    let wHeight = $(window).height();
    let dHeight = wHeight * 0.4;
    $("#dialog-confirm").dialog("option", "width", dWidth);
    $("#dialog-confirm").dialog("option", "height", dHeight);
  });
});
function refreshTable(data) {
  // let HTML = '';
  $("#cardtable tbody > tr").remove();
  $.each(data, function (key, item) {
    let strsex = "";
    if (item.sex == 0) strsex = "男";
    else strsex = "女";
    let row = $("<tr></tr>");
    row.append(
      $(
        `<td data-bs-toggle="tooltip" data-bs-placement="right" title="[${strsex}]${item.cnname}(${item.enname})"></td>`
      ).html(item.cnname)
    );
    row.append($("<td></td>").html(item.enname));
    row.append($("<td></td>").html(strsex));
    row.append(
      $(
        `<td data-bs-toggle="popover" data-bs-placement="bottom" data-bs-content="聯絡方式：${
          String(item.phone).substr(0, 4) +
          "-" +
          String(item.phone).substr(4, 3) +
          "-" +
          String(item.phone).substr(7, 3)
        }"></td>`
      ).html(item.phone)
    );
    row.append($("<td></td>").html(item.email));
    row.append(
      $("<td></td>").html(
        '<button id="modifybutton' +
          item.s_sn +
          '" class="modifybutton btn btn-warning" style="font-size:16px;font-weight:bold;" data-bs-toggle="modal" data-bs-target="#modifyModal">修改 <span class="glyphicon glyphicon-list-alt"></span></button>'
      )
    );
    row.append(
      $("<td></td>").html(
        '<button id="deletebutton' +
          item.s_sn +
          '" class="deletebutton btn btn-danger" style="font-size:16px;font-weight:bold;" data-bs-toggle="modal" data-bs-target="#deleteModal">刪除 <span class="glyphicon glyphicon-trash"></span></button>'
      )
    );
    $("#cardtable").append(row);
  });
}

function initEdit(response) {
  let modifyid = $("#cardtable").attr("id").substring(12);
  $("#mocnname").val(response.cnname);
  $("#moenname").val(response.enname);
  if (response.sex == 0) {
    $("#modifyman").prop("checked", true);
    $("#modifywoman").prop("checked", false);
  } else {
    $("#modifyman").prop("checked", false);
    $("#modifywoman").prop("checked", true);
  }
  $("#mophone").val(response.phone);
  $("#moemail").val(response.email);
  $("#modifysid").val(modifyid);

  $("#moModal-submit").click((e) => {
    e.stopImmediatePropagation();
    e.preventDefault(); // avoid to execute the actual submit of the form.
    let url = "ajax/ajaxCard";
    let cnname = $("#mocnname").val();
    let enname = $("#moenname").val();
    let sex = $('input:radio:checked[name="mosex"]').val();
    let phone = $("#mophone").val();
    let email = $("#moemail").val();
    if (
      !cnname ||
      !sex ||
      !phone ||
      !email ||
      !isValidPhone(phone) ||
      !isValidEmail(email)
    ) {
      if (!cnname) {
        $("#mocnnameErrormessage").text("這裡忘記填囉");
      } else {
        $("#mocnnameErrormessage").text("");
      }
      if (!sex) {
        $("#mosexErrormessage").text("這裡忘記填囉");
      } else {
        $("#mosexErrormessage").text("");
      }
      if (!phone) {
        $("#moPhoneErrorMessage").text("這裡忘記填囉");
      } else if (!isValidPhone(phone)) {
        console.log("isValidPhone", isValidPhone(phone));
        $("#moPhoneErrorMessage").text(
          "格式錯誤，手機號碼應為 10 碼數字並 09 開頭"
        );
      } else {
        $("#moPhoneErrorMessage").text("");
      }
      if (!email) {
        $("#moEmailErrorMessage").text("這裡忘記填囉");
      } else if (!isValidEmail(email)) {
        $("#moEmailErrorMessage").text("格式錯誤");
      } else {
        $("#moEmailErrorMessage").text("");
      }
      return;
    }

    let s_sn = response.s_sn;
    let ajaxobj = new AjaxObject(url, "json");
    ajaxobj.modify({
      s_sn,
      cnname,
      enname,
      sex,
      phone,
      email,
    });
  });
  $("#moModal-reset").on("click", function () {
    $("#moForm")[0].reset();
    $("#mocnnameErrormessage").text("");
    $("#mosexErrormessage").text("");
    $("#addPhoneErrorMessage").text("");
    $("#addEmailErrorMessage").text("");
  });
}

/**
 *
 * @param string
 *          url 呼叫controller的url
 * @param string
 *          datatype 資料傳回格式
 * @uses refreshTable 利用ajax傳回資料更新Table
 */
function AjaxObject(url, datatype) {
  this.url = url;
  this.datatype = datatype;
}
AjaxObject.prototype.cnname = "";
AjaxObject.prototype.enname = "";
AjaxObject.prototype.sex = "";
AjaxObject.prototype.id = 0;
AjaxObject.prototype.phone = "";
AjaxObject.prototype.email = "";
AjaxObject.prototype.s_sn = "";
AjaxObject.prototype.alertt = function () {
  alert("Alert:");
};
AjaxObject.prototype.getall = function () {
  console.log("mock", mockdata);
  refreshTable(mockdata);
  return mockdata;
};
AjaxObject.prototype.add = function (data) {
  mockdata.push(data);
  refreshTable(mockdata);
  $("#addModal").modal("hide");
  return mockdata;
};
AjaxObject.prototype.modify = function (data) {
  console.log("modify data ", data);
  for (let i = 0; i < mockdata.length; i++) {
    if (mockdata[i].s_sn == data.s_sn) {
      mockdata[i].cnname = data.cnname;
      mockdata[i].enname = data.enname;
      mockdata[i].sex = data.sex;
      mockdata[i].phone = data.phone;
      mockdata[i].email = data.email;
    }
  }
  console.log("modify res", mockdata);
  refreshTable(mockdata);
  $("#modifyModal").modal("hide");
};
AjaxObject.prototype.modify_get = function (id) {
  const response = mockdata.find((el) => el.s_sn === id);
  initEdit(response);
};
AjaxObject.prototype.search = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"}]';
  refreshTable(JSON.parse(response));
  $("#dialog-searchconfirm").dialog("close");
};
AjaxObject.prototype.delete = function (id) {
  // const response = mockdata.filter((data) => {
  //   if(data.s_sn !== id) return data
  // });
  mockdata.forEach((data, index, arr) => {
    if (data.s_sn === id) {
      arr.splice(index, 1);
    }
  });
  refreshTable(mockdata);
  return mockdata;
};
