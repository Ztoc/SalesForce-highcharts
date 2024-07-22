({
  tempReportDate: null,
  getCustomerListHelper: function (component, event) {
    component.set("v.spinner", true);
    var action = component.get("c.getCustomerList");
    action.setParams({
      accId: component.get("v.customerId"),
      reportDate: component.get("v.reportDate"),
      customReportId: component.get("v.reportId"),
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      var res = response.getReturnValue();
      if (state === "SUCCESS") {
        if (response.getReturnValue().isSuccess === true) {
          component.set("v.response", res);
          component.set("v.userTypeLoader", true);
          component.set("v.spinner", true);
          component.set("v.customerDetailsNew", res);
          component.set("v.reportDate", res.report_date);
          this.tempReportDate = res.report_date;
          component.set("v.report_Date", res.reportDate);
          var customerList = [];
          var conts = res.customerList;
          for (var key in conts) {
            customerList.push({ value: conts[key], key: key });
          }
          component.set("v.reportId", res.reportId);
          component.set("v.listOfReports", customerList);
          this.loadReportData(component, res.reportId, res.report_date);
        } else {
          component.set("v.spinner", false);
          component.set("v.isError", true);
          component.set("v.selectDate", true);
          var errorMsg = res.errorMessage;
          component.set("v.error", errorMsg);
          // This Temp Variable Is Used To Set The Date Back To Previous Date, If No Data For Selected Date
          if (this.tempReportDate != null) {
            component.set("v.reportDate", this.tempReportDate);
          }
        }
      } else {
        component.set("v.spinner", false);
        component.set("v.isError", true);
        var errorMsg = action.getError()[0].message;
        component.set("v.error", errorMsg);
        // This Temp Variable Is Used To Set The Date Back To Previous Date, If No Data For Selected Date
        if (this.tempReportDate != null) {
          component.set("v.reportDate", this.tempReportDate);
        }
      }
    });
    $A.enqueueAction(action);
  },

  checkDataLoaderCounter: function (component, result) {
    var counter = component.get("v.dataLoaderCounter");
    counter++;
    component.set("v.dataLoaderCounter", counter);
    if (counter == 8) {
      component.set("v.customerDetails", result);
      component.set("v.spinner", false);
      component.set("v.dataLoaderCounter", 0);

      component.set("v.managementDiagnostics", result.management_diagnostics);
      component.set("v.agentDiagnostics", result.agents_diagnostics);

      var agentByTypechartDiv = component.find("agentByTypeChart").getElement().id;
      this.agentByTypeChart(component, agentByTypechartDiv);

      var topSitesChartDiv = component.find("topSiteChart").getElement().id;
      this.topSitesChart(component, topSitesChartDiv, true);

      var topAlertChartDiv = component.find("topAlertChart").getElement().id;
      this.topSitesChart(component, topAlertChartDiv, false);
    }
  },

  loadReportData: function (component, crId, reportDate) {
    component.set("v.spinner", true);

    component.set("v.diagnosticsRetrievedLoader", false);
    component.set("v.alertsAndSitesRetrievedLoader", false);
    component.set("v.agentOsCountRetrievedLoader", false);
    component.set("v.agentTypeRetrievedLoader", false);

    this.getAccessibleUrlHelper(component, crId, reportDate);
    this.getNoOfAgentsHelper(component, crId, reportDate);
    this.getNoOfSitesHelper(component, crId, reportDate);
    this.getNoOfGroupsHelper(component, crId, reportDate);

    this.getDiagnosticsHelper(component, crId, reportDate);
    this.getAlertsAndSitesHelper(component, crId, reportDate);
    this.getAgentOsCountHelper(component, crId, reportDate);
    this.getAgentTypeHelper(component, crId, reportDate);
    window.setTimeout(
      $A.getCallback(function () {
        component.set("v.agentTypeRetrievedLoader", true);
      }),
      3000
    );
    window.setTimeout(
      $A.getCallback(function () {
        component.set("v.alertsAndSitesRetrievedLoader", true);
      }),
      6000
    );
    window.setTimeout(
      $A.getCallback(function () {
        component.set("v.agentOsCountRetrievedLoader", true);
      }),
      8000
    );
  },

  getAccessibleUrlHelper: function (component, crId, reportDate) {
    var action = component.get("c.getAccessibleUrl");
    action.setParams({
      crId: crId,
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var result = component.get("v.customerDetailsNew");
        result.accessible_url = response.getReturnValue();
        component.set("v.customerDetailsNew", result);
        this.checkDataLoaderCounter(component, result);
      } else {
        component.set("v.spinner", false);
        var errorMsg = action.getError()[0].message;
        component.set("v.error", errorMsg);
        var modal = document.getElementById("Error");
        modal.style.display = "block";
      }
    });
    $A.enqueueAction(action);
  },

  getNoOfAgentsHelper: function (component, crId, reportDate) {
    var action = component.get("c.getNoOfAgents");
    action.setParams({
      crId: crId,
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var result = component.get("v.customerDetailsNew");
        result.number_of_agents = response.getReturnValue();
        component.set("v.customerDetailsNew", result);
        this.checkDataLoaderCounter(component, result);
      } else {
        component.set("v.spinner", false);
        var errorMsg = action.getError()[0].message;
        component.set("v.error", errorMsg);
        var modal = document.getElementById("Error");
        modal.style.display = "block";
      }
    });
    $A.enqueueAction(action);
  },

  getNoOfSitesHelper: function (component, crId, reportDate) {
    var action = component.get("c.getNoOfSites");
    action.setParams({
      crId: crId,
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var result = component.get("v.customerDetailsNew");
        result.number_of_sites = response.getReturnValue();
        component.set("v.customerDetailsNew", result);
        this.checkDataLoaderCounter(component, result);
      } else {
        component.set("v.spinner", false);
        var errorMsg = action.getError()[0].message;
        component.set("v.error", errorMsg);
        var modal = document.getElementById("Error");
        modal.style.display = "block";
      }
    });
    $A.enqueueAction(action);
  },

  getNoOfGroupsHelper: function (component, crId, reportDate) {
    var action = component.get("c.getNoOfGroups");
    action.setParams({
      crId: crId,
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var result = component.get("v.customerDetailsNew");
        result.number_of_groups = response.getReturnValue();
        component.set("v.customerDetailsNew", result);
        this.checkDataLoaderCounter(component, result);
      } else {
        component.set("v.spinner", false);
        var errorMsg = action.getError()[0].message;
        component.set("v.error", errorMsg);
        var modal = document.getElementById("Error");
        modal.style.display = "block";
      }
    });
    $A.enqueueAction(action);
  },

  getDiagnosticsHelper: function (component, crId, reportDate) {
    var action = component.get("c.getAgentDiagnostics");
    action.setParams({
      crId: crId,
      reportDate: reportDate,
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        component.set("v.diagnosticsRetrievedLoader", true);
        var result = component.get("v.customerDetailsNew");
        result.agents_diagnostics = response.getReturnValue().agents_diagnostics;
        result.agents_diagnostics2 = response.getReturnValue().agents_diagnostics2;
        result.management_diagnostics = response.getReturnValue().management_diagnostics;
        result.management_diagnostics2 = response.getReturnValue().management_diagnostics2;
        component.set("v.customerDetailsNew", result);

        this.checkDataLoaderCounter(component, result);
      } else {
        component.set("v.spinner", false);
        var errorMsg = action.getError()[0].message;
        component.set("v.error", errorMsg);
        var modal = document.getElementById("Error");
        modal.style.display = "block";
      }
    });
    $A.enqueueAction(action);
  },

  getAlertsAndSitesHelper: function (component, crId) {
    var action = component.get("c.getTopAgentAlertsAndSites");
    action.setParams({
      crId: crId,
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        component.set("v.alertsAndSitesRetrievedLoader", true);
        var result = component.get("v.customerDetailsNew");
        result.topAgentsAlerts = response.getReturnValue().topAgentsAlerts;
        result.topSiteAlerts = response.getReturnValue().topSiteAlerts;
        component.set("v.customerDetailsNew", result);
        this.checkDataLoaderCounter(component, result);
      } else {
        component.set("v.spinner", false);
        var errorMsg = action.getError()[0].message;
        component.set("v.error", errorMsg);
        var modal = document.getElementById("Error");
        modal.style.display = "block";
      }
    });
    $A.enqueueAction(action);
  },

  getAgentOsCountHelper: function (component, crId) {
    var action = component.get("c.getAgentOsCount");
    action.setParams({
      crId: crId,
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var result = component.get("v.customerDetailsNew");
        result.agents_os_count = response.getReturnValue().agents_os_count;
        component.set("v.customerDetailsNew", result);
        this.checkDataLoaderCounter(component, result);
      } else {
        component.set("v.spinner", false);
        var errorMsg = action.getError()[0].message;
        component.set("v.error", errorMsg);
        var modal = document.getElementById("Error");
        modal.style.display = "block";
      }
    });
    $A.enqueueAction(action);
  },

  getAgentTypeHelper: function (component, crId) {
    var action = component.get("c.getAgentType");
    action.setParams({
      crId: crId,
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        component.set("v.agentTypeRetrievedLoader", true);

        var result = component.get("v.customerDetailsNew");
        result.agents_type = response.getReturnValue().agents_type;
        component.set("v.customerDetailsNew", result);
        this.checkDataLoaderCounter(component, result);
      } else {
        component.set("v.spinner", false);
        var errorMsg = action.getError()[0].message;
        component.set("v.error", errorMsg);
        var modal = document.getElementById("Error");
        modal.style.display = "block";
      }
    });
    $A.enqueueAction(action);
  },

  keyPressCallback: function (component, event, helper, detail) {
    var searchText = component.get("v.searchText");
    if (searchText != "" && searchText != null && event.which != 8) {
      var customerDetails = detail;
      if (component.get("v.showManagementDiagnostics")) {
        var result = [];
        for (var i = 0; i < customerDetails.management_diagnostics.length; i++) {
          searchText = searchText.toUpperCase();
          var s1 = customerDetails.management_diagnostics[i].category.toUpperCase();
          var s2 = customerDetails.management_diagnostics[i].sub_category.toUpperCase();
          var s3 = customerDetails.management_diagnostics[i].severity.toUpperCase();
          var s4 = customerDetails.management_diagnostics[i].description.toUpperCase();
          var s5 = customerDetails.management_diagnostics[i].remediation.toUpperCase();
          if (s1.includes(searchText)) {
            result.push(customerDetails.management_diagnostics[i]);
            continue;
          }
          if (s2.includes(searchText)) {
            result.push(customerDetails.management_diagnostics[i]);
            continue;
          }
          if (s3.includes(searchText)) {
            result.push(customerDetails.management_diagnostics[i]);
            continue;
          }
          if (s4.includes(searchText)) {
            result.push(customerDetails.management_diagnostics[i]);
            continue;
          }
          if (s5.includes(searchText)) {
            result.push(customerDetails.management_diagnostics[i]);
            continue;
          }
          var impact = customerDetails.management_diagnostics[i].impacted;
          for (var j = 0; j < impact.length; j++) {
            var site = "";
            if (impact[j].site != undefined) {
              site = impact[j].site.toUpperCase();
            }
            var groupName = "";
            if (impact[j].groupName != undefined) {
              groupName = impact[j].groupName.toUpperCase();
            }
            var details = "";
            if (impact[j].details != undefined) {
              details = impact[j].details.toUpperCase();
            }
            if (site.includes(searchText)) {
              result.push(customerDetails.management_diagnostics[i]);
              break;
            }
            if (groupName.includes(searchText)) {
              result.push(customerDetails.management_diagnostics[i]);
              break;
            }
            if (details.includes(searchText)) {
              result.push(customerDetails.management_diagnostics[i]);
              break;
            }
          }
        }
        component.set("v.managementDiagnostics", result);
      } else {
        var result = [];
        for (var i = 0; i < customerDetails.agents_diagnostics.length; i++) {
          searchText = searchText.toUpperCase();
          var s1 = customerDetails.agents_diagnostics[i].category.toUpperCase();
          var s2 = customerDetails.agents_diagnostics[i].sub_category.toUpperCase();
          var s3 = customerDetails.agents_diagnostics[i].severity.toUpperCase();
          var s4 = customerDetails.agents_diagnostics[i].description.toUpperCase();
          var s5 = customerDetails.agents_diagnostics[i].remediation.toUpperCase();
          if (s1.includes(searchText)) {
            result.push(customerDetails.agents_diagnostics[i]);
            continue;
          }
          if (s2.includes(searchText)) {
            result.push(customerDetails.agents_diagnostics[i]);
            continue;
          }
          if (s3.includes(searchText)) {
            result.push(customerDetails.agents_diagnostics[i]);
            continue;
          }
          if (s4.includes(searchText)) {
            result.push(customerDetails.agents_diagnostics[i]);
            continue;
          }
          if (s5.includes(searchText)) {
            result.push(customerDetails.agents_diagnostics[i]);
            continue;
          }
          var impact = customerDetails.agents_diagnostics[i].impacted;
          for (var j = 0; j < impact.length; j++) {
            var details = "";
            if (impact[j].details != undefined) {
              details = impact[j].details.toUpperCase();
            }
            var os_family = "";
            if (impact[j].os_family != undefined) {
              os_family = impact[j].os_family.toUpperCase();
            }
            var machine_type = "";

            if (impact[j].machine_type != undefined) {
              machine_type = impact[j].machine_type.toUpperCase();
            }
            var agentVersion = "";
            if (impact[j].agentVersion != undefined) {
              agentVersion = impact[j].agentVersion.toUpperCase();
            }
            var computer_name = "";
            if (impact[j].computer_name != undefined) {
              computer_name = impact[j].computer_name.toUpperCase();
            }
            if (details.includes(searchText)) {
              result.push(customerDetails.agents_diagnostics[i]);
              break;
            }
            if (os_family.includes(searchText)) {
              result.push(customerDetails.agents_diagnostics[i]);
              break;
            }
            if (machine_type.includes(searchText)) {
              result.push(customerDetails.agents_diagnostics[i]);
              break;
            }
            if (agentVersion.includes(searchText)) {
              result.push(customerDetails.agents_diagnostics[i]);
              break;
            }
            if (computer_name.includes(searchText)) {
              result.push(customerDetails.agents_diagnostics[i]);
              break;
            }
          }
        }
        component.set("v.agentDiagnostics", result);
      }
    } else if (searchText != "" && searchText != null) {
      var customerDetails = component.get("v.customerDetails");
      customerDetails.agents_diagnostics = customerDetails.agents_diagnostics2;
      customerDetails.management_diagnostics = customerDetails.management_diagnostics2;
      if (component.get("v.showManagementDiagnostics")) {
        var result = [];
        for (var i = 0; i < customerDetails.management_diagnostics.length; i++) {
          searchText = searchText.toUpperCase();
          var s1 = customerDetails.management_diagnostics[i].category.toUpperCase();
          var s2 = customerDetails.management_diagnostics[i].sub_category.toUpperCase();
          var s3 = customerDetails.management_diagnostics[i].severity.toUpperCase();
          var s4 = customerDetails.management_diagnostics[i].description.toUpperCase();
          var s5 = customerDetails.management_diagnostics[i].remediation.toUpperCase();
          if (s1.includes(searchText)) {
            result.push(customerDetails.management_diagnostics[i]);
            continue;
          }
          if (s2.includes(searchText)) {
            result.push(customerDetails.management_diagnostics[i]);
            continue;
          }
          if (s3.includes(searchText)) {
            result.push(customerDetails.management_diagnostics[i]);
            continue;
          }
          if (s4.includes(searchText)) {
            result.push(customerDetails.management_diagnostics[i]);
            continue;
          }
          if (s5.includes(searchText)) {
            result.push(customerDetails.management_diagnostics[i]);
            continue;
          }
          var impact = customerDetails.management_diagnostics[i].impacted;
          for (var j = 0; j < impact.length; j++) {
            var site = "";
            if (impact[j].site != undefined) {
              site = impact[j].site.toUpperCase();
            }
            var groupName = "";
            if (impact[j].groupName != undefined) {
              groupName = impact[j].groupName.toUpperCase();
            }
            var details = "";
            if (impact[j].details != undefined) {
              details = impact[j].details.toUpperCase();
            }
            if (site.includes(searchText)) {
              result.push(customerDetails.management_diagnostics[i]);
              break;
            }
            if (groupName.includes(searchText)) {
              result.push(customerDetails.management_diagnostics[i]);
              break;
            }
            if (details.includes(searchText)) {
              result.push(customerDetails.management_diagnostics[i]);
              break;
            }
          }
        }
        component.set("v.managementDiagnostics", result);
      } else {
        var result = [];
        for (var i = 0; i < customerDetails.agents_diagnostics.length; i++) {
          searchText = searchText.toUpperCase();
          var s1 = customerDetails.agents_diagnostics[i].category.toUpperCase();
          var s2 = customerDetails.agents_diagnostics[i].sub_category.toUpperCase();
          var s3 = customerDetails.agents_diagnostics[i].severity.toUpperCase();
          var s4 = customerDetails.agents_diagnostics[i].description.toUpperCase();
          var s5 = customerDetails.agents_diagnostics[i].remediation.toUpperCase();
          if (s1.includes(searchText)) {
            result.push(customerDetails.agents_diagnostics[i]);
            continue;
          }
          if (s2.includes(searchText)) {
            result.push(customerDetails.agents_diagnostics[i]);
            continue;
          }
          if (s3.includes(searchText)) {
            result.push(customerDetails.agents_diagnostics[i]);
            continue;
          }
          if (s4.includes(searchText)) {
            result.push(customerDetails.agents_diagnostics[i]);
            continue;
          }
          if (s5.includes(searchText)) {
            result.push(customerDetails.agents_diagnostics[i]);
            continue;
          }
          var impact = customerDetails.agents_diagnostics[i].impacted;
          for (var j = 0; j < impact.length; j++) {
            var details = "";
            if (impact[j].details != undefined) {
              details = impact[j].details.toUpperCase();
            }
            var os_family = "";
            if (impact[j].os_family != undefined) {
              os_family = impact[j].os_family.toUpperCase();
            }
            var machine_type = "";
            if (impact[j].machine_type != undefined) {
              machine_type = impact[j].machine_type.toUpperCase();
            }
            var agentVersion = "";
            if (impact[j].agentVersion != undefined) {
              agentVersion = impact[j].agentVersion.toUpperCase();
            }
            var computer_name = "";
            if (impact[j].computer_name != undefined) {
              computer_name = impact[j].computer_name.toUpperCase();
            }
            if (details.includes(searchText)) {
              result.push(customerDetails.agents_diagnostics[i]);
              break;
            }
            if (os_family.includes(searchText)) {
              result.push(customerDetails.agents_diagnostics[i]);
              break;
            }
            if (machine_type.includes(searchText)) {
              result.push(customerDetails.agents_diagnostics[i]);
              break;
            }
            if (agentVersion.includes(searchText)) {
              result.push(customerDetails.agents_diagnostics[i]);
              break;
            }
            if (computer_name.includes(searchText)) {
              result.push(customerDetails.agents_diagnostics[i]);
              break;
            }
          }
        }

        component.set("v.agentsDiagnostics", result);
      }
    }
  },
  getUserType: function (component, event, helper) {
    component.set("v.spinner", true);
    var action = component.get("c.userType");
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        component.set("v.isCommunity", response.getReturnValue());
        if (response.getReturnValue()) {
          //component.set("v.communityUrl","/community");
        } else {
          //component.set("v.communityUrl","");
        }
        component.set("v.spinner", false);
      } else {
        var errors = response.getError();
        component.set("v.spinner", false);
      }
      helper.getCustomerListHelper(component, event);
    });
    $A.enqueueAction(action);
  },

  /* Methods Related To Ignore Alerts */
  /* START */

  removeAlertHelper: function (component, event, helper, selectedRecord, isImpact, isIgnoreAll) {
    var action = component.get("c.removeCurrentAlert");
    action.setParams({
      management: !isImpact ? selectedRecord : null,
      impact: isImpact ? selectedRecord : null,
      reportId: component.get("v.reportId"),
      isIgnoreAll: isIgnoreAll,
    });
    action.setCallback(this, function (response) {
      var result = response.getReturnValue();
      if (result) {
        var msg = "The ignored alerts wouldn't show after refresh";
        var msgMethod = component.get("v.showToastMessage");
        msgMethod(msg, function () {});
      }
    });
    $A.enqueueAction(action);
  },

  removeDetailAlertHelper: function (component, event, helper, management, impact, isImpact, isIgnoreAll) {
    var action = component.get("c.removeAlertCheckImpact");
    action.setParams({
      management: management,
      impact: impact,
      reportId: component.get("v.reportId"),
      isIgnoreAll: isIgnoreAll,
    });
    action.setCallback(this, function (response) {
      var result = response.getReturnValue();
      if (result) {
        var msg = "The ignored alerts wouldn't show after refresh";
        var msgMethod = component.get("v.showToastMessage");
        msgMethod(msg, function () {});
      }
    });
    $A.enqueueAction(action);
  },
  /* END */
  // New UI Development
  agentByTypeChart: function (component, divName) {
    var agentByType = component.get("v.customerDetailsNew").agents_type;
    var chartColors = component.get("v.customerDetailsNew").chartColor.agentByTye;
    var jsonData = [
      {
        name: "Desktop",
        y: agentByType.desktop == undefined ? 0 : agentByType.desktop,
        logo: $A.get("$Resource.desktop_logo"),
      },
      {
        name: "Laptop",
        y: agentByType.laptop == undefined ? 0 : agentByType.laptop,
        logo: $A.get("$Resource.laptop_logo"),
      },
      {
        name: "Server",
        y: agentByType.server == undefined ? 0 : agentByType.server,
        logo: $A.get("$Resource.server_logo"),
      },
      {
        name: "Kubernetes",
        y: agentByType.kubernetes == undefined ? 0 : agentByType.kubernetes,
        logo: $A.get("$Resource.kubernet_logo"),
      },
    ];
    var totalAgents = jsonData.reduce(function (acc, point) {
      return acc + point.y;
    }, 0);
    var plot = new Highcharts.Chart(divName, {
      chart: {
        renderTo: divName,
        type: "pie",
        plotBackgroundColor: null,
        backgroundColor: "#FFFFFF",
        height: 108,
        options3d: {
          enabled: true,
          alpha: 45,
        },
        reflow: true,
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
        events: {
          render: function () {
            // Remove existing labels if present
            if (this.totalLabel) {
              this.totalLabel.destroy();
            }
            if (this.numberLabel) {
              this.numberLabel.destroy();
            }

            // Coordinates for the center of the chart
            var centerX = this.plotLeft + this.plotWidth * 0.5;
            var centerY = this.plotTop + this.plotHeight * 0.5;

            // Create the 'Total' label
            this.totalLabel = this.renderer
              .text("Total", centerX, centerY - 10)
              .css({
                textAlign: "center",
                fontSize: "13px",
                color: "#000000",
              })
              .attr({
                zIndex: 5,
              })
              .add();

            // Center the 'Total' label horizontally
            this.totalLabel.attr({
              x: centerX - this.totalLabel.getBBox().width * 0.5,
            });

            // Create the numeric value label
            this.numberLabel = this.renderer
              .text(totalAgents.toString(), centerX, centerY + 20)
              .css({
                textAlign: "center",
                fontSize: "13px",
                fontWeight: "bold",
                color: "#000000",
              })
              .attr({
                zIndex: 5,
              })
              .add();

            // Center the numeric value label horizontally
            this.numberLabel.attr({
              x: centerX - this.numberLabel.getBBox().width * 0.5,
            });
          },
        },
      },
      title: "",
      colors: [chartColors.desktop, chartColors.laptop, chartColors.server, chartColors.kubernet],
      tooltip: {
        formatter: function () {
          // Formatting the point.y value without thousands separator
          var formattedY = Highcharts.numberFormat(this.point.y, 0, "", "");
          return (
            "<b>" +
            this.point.name +
            ": " +
            formattedY +
            " (" +
            Highcharts.numberFormat(this.point.percentage, 1) +
            "%)</b>"
          );
        },
        shared: true,
        useHTML: true,
        backgroundColor: "#000000",
        style: {
          color: "#FFFFFF",
        },
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: false,
          },
          slicedOffset: 0,
          borderWidth: 1,
          innerSize: "80%",
          depth: 10,
          style: {
            shadow: true,
          },
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        marginLeft: 10,
        padding: 0,
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
        itemMarginBottom: 8,
        symbolPadding: 8,
        useHTML: true,
        itemStyle: {
          color: "#757575",
          fontFamily: "LatoFont",
          fontSize: "11px",
          fontStyle: "normal",
          fontWeight: "400",
          lineHeight: "12px",
          letterSpacing: "0.5px",
          textTransform: "capitalize",
        },
        labelFormatter: function () {
          return `<span style="display:inline-block; width:116px;"><img style="float:left;" src="${
            this.logo
          }"/><span style="float:left;margin-left:8px; text-overflow:ellipsis; max-width:50px;overflow:hidden" >${
            this.name
          }</span><span style="float:right">${this.percentage.toFixed(2)}%</span></span>`;
        },
      },
      series: [
        {
          showInLegend: true,
          type: "pie",
          data: jsonData,
          size: 108,
          innerSize: 90,
          pointPadding: 0,
          groupPadding: 0,
        },
      ],
    });
  },
  topSitesChart: function (component, divName, isSiteAlert) {
    var data;
    if (isSiteAlert) {
      data = component.get("v.customerDetailsNew").topSiteAlerts;
    } else {
      data = component.get("v.customerDetailsNew").topAgentsAlerts;
    }
    var category = [];
    var statusCount = [];
    for (var i in data) {
      category.push(i);
      statusCount.push(data[i]);
    }
    var plot = new Highcharts.chart(divName, {
      chart: {
        type: "bar",
      },
      title: "",
      xAxis: {
        categories: category,
        title: {
          text: "",
        },
        gridLineWidth: 0,
        lineWidth: 0,
      },
      yAxis: {
        min: 0,
        title: {
          text: "",
        },
        labels: {
          overflow: "justify",
        },
        gridLineWidth: 1,
      },
      tooltip: {
        formatter: function () {
          return "<b>" + this.x + "</b> " + this.series.name + ": " + this.y;
        },
        backgroundColor: "#000000",
        style: {
          color: "#FFFFFF",
          fontWeight: "bold",
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
          groupPadding: 0.2,
          pointPadding: 0.1, // Adjust this value to fix spacing
        },
        series: {
          pointWidth: 9,
          pointPadding: 0.1,
          groupPadding: 0.1,
        },
      },
      colors: [component.get("v.customerDetailsNew").chartColor.alertChartColor],
      credits: {
        enabled: false,
      },
      series: [
        {
          showInLegend: false,
          name: "",
          data: statusCount,
        },
      ],
    });
  },
  convertArrayOfObjectsToCSV: function (component, objectRecords, recordType) {
    var csvStringResult, counter, keys, columnDivider, lineDivider;
    if (objectRecords == null || !objectRecords.length) {
      return null;
    }
    columnDivider = ",";
    lineDivider = "\n";
    if (recordType == "MD") {
      keys = ["categoryId", "groupName", "item_id", "site"];
    } else {
      keys = ["agent_version", "categoryId", "computer_name", "details", "item_id", "machine_type", "os_family"];
    }
    csvStringResult = "";
    csvStringResult += keys.join(columnDivider);
    csvStringResult += lineDivider;

    for (var i = 0; i < objectRecords.length; i++) {
      counter = 0;
      for (var sTempkey in keys) {
        var skey = keys[sTempkey];
        if (counter > 0) {
          csvStringResult += columnDivider;
        }
        csvStringResult += '"' + objectRecords[i][skey] + '"';
        counter++;
      }
      csvStringResult += lineDivider;
    }
    return csvStringResult;
  },
  downloadToCSV: function (component, event, helper, csv, sectionName) {
    var fileName =
      "Proactive Report -" +
      component.get("v.customerDetailsNew").customer_name +
      " - " +
      component.get("v.reportDate") +
      " - " +
      sectionName +
      ".csv";
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_self";
    hiddenElement.download = fileName;
    document.body.appendChild(hiddenElement);
    hiddenElement.click();
  },
});
