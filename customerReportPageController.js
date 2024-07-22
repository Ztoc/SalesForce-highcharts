({
  scriptsLoaded: function (component, event, helper) {
    component.set("v.spinner", true);
    helper.getUserType(component, event, helper);
  },
  prepareData: function (component, event, helper) {
    var customerDetails = component.get("v.customerDetails");
    var topAgent = [];
    var topAgentValue = [];
    var topAgentValue2 = {};
    for (var key in customerDetails.topAgentsAlerts) {
      topAgent.push(key);
      topAgentValue.push(customerDetails.topAgentsAlerts[key]);
      topAgentValue2[key] = customerDetails.topAgentsAlerts[key];
    }
    var topSite = [];
    var topSiteValue = [];
    var topSiteValue2 = {};

    for (var key in customerDetails.topSiteAlerts) {
      topSite.push(key);
      topSiteValue.push(customerDetails.topSiteAlerts[key]);
      topSiteValue2[key] = customerDetails.topSiteAlerts[key];
    }
    component.set("v.spinner", false);
  },
  CheckImpact: function (component, event, helper) {
    if (component.get("v.isCommunity")) {
      document.body.scrollIntoView();
    }
    var id = event.getSource().get("v.name");
    var data;
    if (component.get("v.MD")) {
      data = component.get("v.customerDetails").management_diagnostics;
    } else {
      data = component.get("v.customerDetails").agents_diagnostics;
    }
    for (var i = 0; i < data.length; i++) {
      if (id == data[i].id) {
        component.set("v.currentPopUpRecord", data[i]);
      }
    }
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  },
  close: function (component, event, helper) {
    component.set("v.currentPopUpRecord", null);
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  },
  fireevent: function (component, event, helper) {
    var myEvent = $A.get("e.c:fireEvent");
    var refreshedReportId = component.get("v.reportId");
    myEvent.setParams({ data: "downloadFullPage", refreshedRepId: refreshedReportId });
    debugger;
    myEvent.fire();
  },
  DownloadSingleDetail: function (component, event, helper) {
    var md = null,
      ad = null;
    if (component.get("v.MD")) {
      md = component.get("v.currentPopUpRecord");
    } else {
      ad = component.get("v.currentPopUpRecord");
    }
    var action = component.get("c.downloadCSV");
    action.setParams({
      ad: ad,
      md: md,
      isImpact: component.get("v.currentPopUpRecord.isImpact"),
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var csvFile = new Blob(["\ufeff", response.getReturnValue()]);
        var downloadLink = document.createElement("a");
        downloadLink.download = "Impact.csv";
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        downloadLink.target = "_blank";
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    });
    $A.enqueueAction(action);
  },
  forwardDetail: function (component, event, helper) {
    if (component.get("v.isCommunity")) {
      document.body.scrollIntoView();
    }
  },
  forward: function (component, event, helper) {
    component.set("v.opneEmailpopUp", true);
    if (component.get("v.isCommunity")) {
      document.body.scrollIntoView();
    }
    var myEvent = $A.get("e.c:fireEvent");
    myEvent.setParams({ data: "forwardHomePage" });
    myEvent.fire();
    if (component.get("v.isCommunity")) {
      document.body.scrollIntoView();
    }
  },
  send: function (component, event, helper) {
    component.set("v.spinner2", true);
    var mailTo = component.get("v.mailTo");
    var mailCc = component.get("v.mailCc");
    var mailBcc = component.get("v.mailBcc");
    var mailSubject = component.get("v.mailSubject");
    var mailBody = component.get("v.mailBody");
    var element = "";
    if (document.getElementById("theHiddenInput")) {
      element = document.getElementById("theHiddenInput").value;
    }
    var md = null;
    var ad = null;
    if (component.get("v.MD")) {
      md = component.get("v.currentPopUpRecord");
    } else {
      ad = component.get("v.currentPopUpRecord");
    }
    if (mailTo != null && mailSubject != null) {
      var action = component.get("c.sendMail");
      action.setParams({
        toAddress: mailTo,
        ccAddress: mailCc,
        bccAddress: mailBcc,
        subject: mailSubject,
        body: mailBody,
        pdf: element,
        parentId: component.get("v.customerId"),
        ad: ad,
        md: md,
        reportDate: component.get("v.customerDetailsNew").report_date,
        reportId: component.get("v.customerDetailsNew").reportId,
        accId: component.get("v.customerId"),
      });
      action.setCallback(this, function (response) {
        var state = response.getState();
        if (state === "SUCCESS") {
          component.set("v.opneEmailpopUp", false);
          component.set("v.mailTo", null);
          component.set("v.mailCc", null);
          component.set("v.mailBcc", null);
          component.set("v.mailSubject", null);
          component.set("v.mailBody", null);
          component.set("v.spinner2", false);
        } else {
          component.set("v.spinner2", false);
        }
      });
      $A.enqueueAction(action);
      var modal = document.getElementById("emailErrorMessage");
      if (modal) {
        modal.style.display = "none";
      }
    } else {
      var modal = document.getElementById("emailErrorMessage");
      if (modal) {
        modal.style.display = "block";
      }
      component.set("v.spinner2", false);
    }
  },
  backToTop: function (component, event, helper) {
    try {
      document.body.scrollIntoView({ behavior: "smooth" });
    } catch (e) {}
  },
  dateChange: function (component, event, helper) {
    component.set("v.dataLoaderCounter", 0);
    component.set("v.agentTypeRetrievedLoader", false);
    component.set("v.alertsAndSitesRetrievedLoader", false);
    component.set("v.agentOsCountRetrievedLoader", false);
    component.set("v.diagnosticsRetrievedLoader", false);
    component.set("v.selectDate", false);
    component.set("v.reportId", null);
    helper.getCustomerListHelper(component, event);
  },
  reportChange: function (component, event, helper) {
    var customers = component.get("v.listOfReports");
    for (var c in customers) {
      if (customers[c].key == event.getSource().get("v.value")) {
        var cd = component.get("v.customerDetails");
        cd.customer_name = customers[c].value;
        component.set("v.customerDetailsNew", cd);
      }
    }
    component.set("v.selectCustName", false);
    helper.loadReportData(component, component.get("v.reportId"), component.get("v.reportDate"));
  },
  closeError: function (component, event, helper) {
    component.set("v.isError", false);
  },
  closeEmail: function (component, event, helper) {
    component.set("v.opneEmailpopUp", false);
    component.set("v.mailTo", null);
    component.set("v.mailCc", null);
    component.set("v.mailBcc", null);
    component.set("v.mailSubject", null);
    component.set("v.mailBody", null);
  },
  ignore: function (component, event, helper) {
    var impactId = event.getSource().get("v.name");
    var diagnosticsType;
    if (component.get("v.MD")) {
      diagnosticsType = "Management Diagnostics";
    } else {
      diagnosticsType = "Agents Diagnostics";
    }
    component.set("v.spinner2", true);
    var action = component.get("c.sendMail");
    action.setParams({
      diagnosticsType: diagnosticsType,
      impactId: impactId,
      reportId: component.get("v.reportId"),
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
      } else {
        component.set("v.spinner2", false);
      }
    });
    $A.enqueueAction(action);
  },

  /* Methods Related To Ignore Alerts */
  /* START */

  removeAlert: function (component, event, helper) {
    var getRecord = event.currentTarget;
    var index = getRecord.dataset.record;
    var isManagementDiagnostics = component.get("v.MD");
    var selectedRecord;
    if (isManagementDiagnostics) {
      selectedRecord = component.get("v.managementDiagnostics")[index];
      var managementElements = document.getElementById("manage-tr-" + index);
      managementElements.className += " manageClass";
      var eyeClosedDisplay = document.getElementById("eyeClosed-" + index);
      var eyeOpenDisplay = document.getElementById("eyeOpen-" + index);
      eyeClosedDisplay.style.display = "none";
      eyeOpenDisplay.style.display = "block";
    } else {
      selectedRecord = component.get("v.agentDiagnostics")[index];
      var agentElements = document.getElementById("agent-tr-" + index);
      agentElements.className += " manageClass";
      var eyeClosedDisplay = document.getElementById("eyeClosed-" + index);
      var eyeOpenDisplay = document.getElementById("eyeOpen-" + index);
      eyeClosedDisplay.style.display = "none";
      eyeOpenDisplay.style.display = "block";
    }
    helper.removeAlertHelper(component, event, helper, selectedRecord, false, false);
  },

  addAlert: function (component, event, helper) {
    var getRecord = event.currentTarget;
    var index = getRecord.dataset.record;
    var isManagementDiagnostics = component.get("v.MD");
    var selectedRecord;
    if (isManagementDiagnostics) {
      selectedRecord = component.get("v.managementDiagnostics")[index];
      var managementElements = document.getElementById("manage-tr-" + index);
      managementElements.classList.remove("manageClass");
      var eyeClosedDisplay = document.getElementById("eyeClosed-" + index);
      var eyeOpenDisplay = document.getElementById("eyeOpen-" + index);
      eyeClosedDisplay.style.display = "block";
      eyeOpenDisplay.style.display = "none";
    } else {
      selectedRecord = component.get("v.agentDiagnostics")[index];
      var agentElements = document.getElementById("agent-tr-" + index);
      agentElements.classList.remove("manageClass");
      var eyeClosedDisplay = document.getElementById("eyeClosed-" + index);
      var eyeOpenDisplay = document.getElementById("eyeOpen-" + index);
      eyeClosedDisplay.style.display = "block";
      eyeOpenDisplay.style.display = "none";
    }
  },

  openIgnoredAlertsManagement: function (component, event, helper) {
    var url = "IgnoredAlertsManagementPage?encryptedAccountId=" + encodeURIComponent(component.get("v.customerId"));
    let reportId = component.get("v.reportId");
    if (reportId) {
      url += "&reportId=" + reportId;
    }
    var urlMethod = component.get("v.showIgnoredAlertsManagement");
    urlMethod(url, function () {});
  },

  removeDetailAlert: function (component, event, helper) {
    var getRecord = event.currentTarget;
    var index = getRecord.dataset.record;
    var ignoreall = false;
    if (getRecord.dataset.ignoreall === "true") {
      ignoreall = true;
    }
    var impactedElements = document.getElementsByClassName("hide-" + index);
    for (var i = 0; i < impactedElements.length; i++) {
      impactedElements[i].className += " manageClass";
    }
    var eyeClosedDisplay = document.getElementById("detailEyeClosed-" + index);
    var eyeOpenDisplay = document.getElementById("detailEyeOpen-" + index);
    eyeClosedDisplay.style.display = "none";
    eyeOpenDisplay.style.display = "block";
    if (ignoreall) {
      var selectedRecord = component.get("v.currentPopUpRecord");
      //helper.removeDetailAlertHelper(component, event, helper, component.get('v.currentPopUpRecord'), null, false, true);
      helper.removeAlertHelper(component, event, helper, selectedRecord, false, false);
    } else {
      var selectedRecord = component.get("v.currentPopUpRecord.impacted")[index];
      helper.removeDetailAlertHelper(
        component,
        event,
        helper,
        component.get("v.currentPopUpRecord"),
        selectedRecord,
        true,
        false
      );
    }
  },

  showHideDropdown: function (component, event, handler) {
    var getRecord = event.currentTarget;
    var index = getRecord.dataset.record;
    var listItems = document.getElementById("listItems-" + index);
    var openEyeImage = document.getElementById("openEyeImage-" + index);
    if (listItems.style.display == "none" || listItems.style.display == "none !important") {
      listItems.style.display = "block";
    } else {
      listItems.style.display = "none";
    }
  },

  showEyeIcon: function (component, event, handler) {
    var index = event.currentTarget.dataset.record;
    var trEyeManage = document.getElementById("toShowEyeIconManage-" + index);
    var trEyeAgent = document.getElementById("toShowEyeIconAgent-" + index);
    var isManagementDiagnostics = component.get("v.MD");
    if (isManagementDiagnostics) {
      trEyeManage.style.display = "block";
    } else {
      trEyeAgent.style.display = "block";
    }
  },

  hideEyeIcon: function (component, event, handler) {
    var index = event.currentTarget.dataset.record;
    var trEyeManage = document.getElementById("toShowEyeIconManage-" + index);
    var trEyeAgent = document.getElementById("toShowEyeIconAgent-" + index);
    var isManagementDiagnostics = component.get("v.MD");
    if (isManagementDiagnostics) {
      trEyeManage.style.display = "none";
    } else {
      trEyeAgent.style.display = "none";
    }
  },

  showEyeIconForDetails: function (component, event, handler) {
    var getRecord = event.currentTarget;
    var index = getRecord.dataset.record;
    var trDetailsEyeManage = document.getElementById("toShowEyeIconTdManageDEtails-" + index);
    var trDetailsEyeAgent = document.getElementById("toShowEyeIconTdAgentDEtails-" + index);
    var isManagementDiagnostics = component.get("v.MD");
    if (isManagementDiagnostics) {
      trDetailsEyeManage.style.display = "block";
    } else {
      trDetailsEyeAgent.style.display = "block";
    }
  },

  hideEyeIconForDetails: function (component, event, handler) {
    var getRecord = event.currentTarget;
    var index = getRecord.dataset.record;
    var trDetailsEyeManage = document.getElementById("toShowEyeIconTdManageDEtails-" + index);
    var trDetailsEyeAgent = document.getElementById("toShowEyeIconTdAgentDEtails-" + index);
    var isManagementDiagnostics = component.get("v.MD");
    if (isManagementDiagnostics) {
      trDetailsEyeManage.style.display = "none";
    } else {
      trDetailsEyeAgent.style.display = "none";
    }
  },

  /* END */

  // New Development
  clickMD: function (component, event, helper) {
    var requiredBtn = component.find("MD");
    $A.util.addClass(requiredBtn, "diagnostics-btn");
    var toRemove = component.find("AD");
    $A.util.removeClass(toRemove, "diagnostics-btn");
    component.set("v.MD", true);
    component.set("v.AD", false);
  },
  clickAD: function (component, event, helper) {
    var requiredBtn = component.find("AD");
    $A.util.addClass(requiredBtn, "diagnostics-btn");
    var toRemove = component.find("MD");
    $A.util.removeClass(toRemove, "diagnostics-btn");
    component.set("v.AD", true);
    component.set("v.MD", false);
  },
  openCheckImpact: function (component, event, helper) {
    try {
      document.body.scrollIntoView();
    } catch (e) {}
    var btnId = event.currentTarget.id;
    if (component.get("v.MD") == true) {
      var mgmtDiag = component.get("v.customerDetailsNew").management_diagnostics2;
      for (var i in mgmtDiag) {
        if (mgmtDiag[i].id == btnId) {
          component.set("v.currentPopUpRecord", mgmtDiag[i]);
          break;
        }
      }
    } else if (component.get("v.AD") == true) {
      var agntDiag = component.get("v.customerDetailsNew").agents_diagnostics2;
      for (var i in agntDiag) {
        if (agntDiag[i].id == btnId) {
          component.set("v.currentPopUpRecord", agntDiag[i]);
          break;
        }
      }
    }

    component.set("v.impactCheckModal", true);
  },
  closeModal: function (component, event, helper) {
    component.set("v.impactCheckModal", false);
    component.set("v.currentPopUpRecord", {});
  },
  searchRecords: function (component, event, helper) {
    var searchKey = event.getSource().get("v.value").toString().toLowerCase();
    if (component.get("v.MD") == true) {
      var recomList = component.get("v.customerDetailsNew").management_diagnostics2;
      var filteredData = recomList.filter(
        (x) =>
          x.category.toLowerCase().includes(searchKey) ||
          x.description.toLowerCase().includes(searchKey) ||
          x.remediation.toLowerCase().includes(searchKey) ||
          x.sub_category.toLowerCase().includes(searchKey) ||
          x.severity.toLowerCase().includes(searchKey)
      );
      component.set("v.customerDetailsNew.management_diagnostics", filteredData);
    } else if (component.get("v.AD") == true) {
      var recomList = component.get("v.customerDetailsNew").agents_diagnostics2;
      var filteredData = recomList.filter(
        (x) =>
          x.category.toLowerCase().includes(searchKey) ||
          x.description.toLowerCase().includes(searchKey) ||
          x.remediation.toLowerCase().includes(searchKey) ||
          x.sub_category.toLowerCase().includes(searchKey) ||
          x.severity.toLowerCase().includes(searchKey)
      );
      component.set("v.customerDetailsNew.agents_diagnostics", filteredData);
    }
  },
  downloadAsCsv: function (component, event, helper) {
    var csvData = component.get("v.currentPopUpRecord").impacted;
    var csv;
    if (component.get("v.MD") == true) {
      csv = helper.convertArrayOfObjectsToCSV(component, csvData, "MD");
      if (csv == null) {
        return;
      }
      helper.downloadToCSV(component, event, helper, csv, "Management Diagnostics");
    } else if (component.get("v.AD") == true) {
      csv = helper.convertArrayOfObjectsToCSV(component, csvData, "AD");
      if (csv == null) {
        return;
      }
      helper.downloadToCSV(component, event, helper, csv, "Agent Diagnostics");
    }
  },
  doSorting: function (component, event, helper) {
    var sortBy = event.currentTarget.id;
    var sortDirectionVal;
    var impectedRec = component.get("v.currentPopUpRecord").impacted;
    switch (sortBy) {
      case "computerName":
        sortDirectionVal = component.get("v.computerNameSorted");
        if (sortDirectionVal == "none" || sortDirectionVal == "desc") {
          impectedRec = impectedRec.sort((a, b) =>
            a.computer_name > b.computer_name ? 1 : b.computer_name > a.computer_name ? -1 : 0
          );
          component.set("v.currentPopUpRecord.impacted", impectedRec);
          component.set("v.computerNameSorted", "asc");
        } else if (sortDirectionVal == "asc") {
          impectedRec = impectedRec.sort((a, b) =>
            a.computer_name > b.computer_name ? 1 : b.computer_name > a.computer_name ? -1 : 0
          );
          impectedRec = impectedRec.reverse();
          component.set("v.currentPopUpRecord.impacted", impectedRec);
          component.set("v.computerNameSorted", "desc");
        }
        break;
      case "machineType":
        sortDirectionVal = component.get("v.machineTypeSorted");
        if (sortDirectionVal == "none" || sortDirectionVal == "desc") {
          impectedRec = impectedRec.sort((a, b) =>
            a.machine_type > b.machine_type ? 1 : b.machine_type > a.machine_type ? -1 : 0
          );
          component.set("v.currentPopUpRecord.impacted", impectedRec);
          component.set("v.machineTypeSorted", "asc");
        } else if (sortDirectionVal == "asc") {
          impectedRec = impectedRec.sort((a, b) =>
            a.machine_type > b.machine_type ? 1 : b.machine_type > a.machine_type ? -1 : 0
          );
          impectedRec = impectedRec.reverse();
          component.set("v.currentPopUpRecord.impacted", impectedRec);
          component.set("v.machineTypeSorted", "desc");
        }
        break;
      case "os":
        sortDirectionVal = component.get("v.osSorted");
        if (sortDirectionVal == "none" || sortDirectionVal == "desc") {
          impectedRec = impectedRec.sort((a, b) =>
            a.os_family > b.os_family ? 1 : b.os_family > a.os_family ? -1 : 0
          );
          component.set("v.currentPopUpRecord.impacted", impectedRec);
          component.set("v.osSorted", "asc");
        } else if (sortDirectionVal == "asc") {
          impectedRec = impectedRec.sort((a, b) =>
            a.os_family > b.os_family ? 1 : b.os_family > a.os_family ? -1 : 0
          );
          impectedRec = impectedRec.reverse();
          component.set("v.currentPopUpRecord.impacted", impectedRec);
          component.set("v.osSorted", "desc");
        }
        break;
      case "agentVersion":
        sortDirectionVal = component.get("v.agentVersionSorted");
        if (sortDirectionVal == "none" || sortDirectionVal == "desc") {
          impectedRec = impectedRec.sort((a, b) =>
            a.agent_version > b.agent_version ? 1 : b.agent_version > a.agent_version ? -1 : 0
          );
          component.set("v.currentPopUpRecord.impacted", impectedRec);
          component.set("v.agentVersionSorted", "asc");
        } else if (sortDirectionVal == "asc") {
          impectedRec = impectedRec.sort((a, b) =>
            a.agent_version > b.agent_version ? 1 : b.agent_version > a.agent_version ? -1 : 0
          );
          impectedRec = impectedRec.reverse();
          component.set("v.currentPopUpRecord.impacted", impectedRec);
          component.set("v.agentVersionSorted", "desc");
        }
        break;
      case "details":
        sortDirectionVal = component.get("v.detailsSorted");
        if (sortDirectionVal == "none" || sortDirectionVal == "desc") {
          impectedRec = impectedRec.sort((a, b) => (a.details > b.details ? 1 : b.details > a.details ? -1 : 0));
          component.set("v.currentPopUpRecord.impacted", impectedRec);
          component.set("v.detailsSorted", "asc");
        } else if (sortDirectionVal == "asc") {
          impectedRec = impectedRec.sort((a, b) => (a.details > b.details ? 1 : b.details > a.details ? -1 : 0));
          impectedRec = impectedRec.reverse();
          component.set("v.currentPopUpRecord.impacted", impectedRec);
          component.set("v.detailsSorted", "desc");
        }
        break;
      case "groupName":
        sortDirectionVal = component.get("v.groupNameSorted");
        if (sortDirectionVal == "none" || sortDirectionVal == "desc") {
          impectedRec = impectedRec.sort((a, b) =>
            a.groupName > b.groupName ? 1 : b.groupName > a.groupName ? -1 : 0
          );
          component.set("v.currentPopUpRecord.impacted", impectedRec);
          component.set("v.groupNameSorted", "asc");
        } else if (sortDirectionVal == "asc") {
          impectedRec = impectedRec.sort((a, b) =>
            a.groupName > b.groupName ? 1 : b.groupName > a.groupName ? -1 : 0
          );
          impectedRec = impectedRec.reverse();
          component.set("v.currentPopUpRecord.impacted", impectedRec);
          component.set("v.groupNameSorted", "desc");
        }
        break;
      case "site":
        sortDirectionVal = component.get("v.siteSorted");
        if (sortDirectionVal == "none" || sortDirectionVal == "desc") {
          impectedRec = impectedRec.sort((a, b) => (a.site > b.site ? 1 : b.site > a.site ? -1 : 0));
          component.set("v.currentPopUpRecord.impacted", impectedRec);
          component.set("v.siteSorted", "asc");
        } else if (sortDirectionVal == "asc") {
          impectedRec = impectedRec.sort((a, b) => (a.site > b.site ? 1 : b.site > a.site ? -1 : 0));
          impectedRec = impectedRec.reverse();
          component.set("v.currentPopUpRecord.impacted", impectedRec);
          component.set("v.siteSorted", "desc");
        }
        break;
      default:
        break;
    }
  },
  openAccessibleUrl: function (component, event, helper) {
    window.open(component.get("v.customerDetailsNew").accessible_url);
  },
  openDropDown: function (component, event, helper) {
    component.set("v.selectCustName", true);
  },
  selectDate: function (component, event, helper) {
    component.set("v.selectDate", true);
  },
});
