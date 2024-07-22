({
    getUserType: function (component, event, helper) {
        var action = component.get('c.userType');
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                component.set('v.isCommunity', response.getReturnValue());
                if (response.getReturnValue()) {
                    component.set('v.communityUrl', '/community');
                } else {
                    component.set('v.communityUrl', '');
                }
            } else {
                var errors = response.getError();

        });
        $A.enqueueAction(action);
    },

    reportChange: function (component, event, helper) {
        // var modal = document.getElementById('Error');
        // modal.style.display = 'none';
        component.set('v.spinner', true);
        // helper.getUserType(component, event, helper);
        helper.getCustomerDetails(component, event, helper);
    },

    getCustomerDetails: function (component, event, helper) {
        component.set('v.spinner', true);
        var action = component.get('c.getAllCustomerInformation');
        console.log('customerId', component.get('v.customerId'));
        console.log('selectedDate', component.get('v.selectedDate'));
        console.log('reportId', component.get('v.reportId'));

        action.setParams({
            accId: component.get('v.customerId'),
            reportDate: null,
            customReportId: component.get('v.reportId')
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            console.log('state ', state);
            console.log('response ', JSON.stringify(response.getReturnValue()));
            if (state === 'SUCCESS') {
                if (response.getReturnValue().isSuccess === true) {
                    component.set('v.spinner', false);
                    var customerDetails = response.getReturnValue();
                    if (customerDetails.threatServiceReport.customerList != undefined) {
                        var availableReport = customerDetails.threatServiceReport.customerList;
                        var custs = [];
                        for (var key in availableReport) {
                            custs.push({ value: availableReport[key], key: key });
                        }
                        component.set('v.customersList', custs);
                    }
                    if (customerDetails.threatServiceReport.dateReportMap != undefined) {
                        var availableDates = customerDetails.threatServiceReport.dateReportMap;
                        var dates = [];
                        for (var key in availableDates) {
                            dates.push({ value: availableDates[key], key: key });
                        }
                        component.set('v.datesList', dates);
                    }

                    component.set('v.headerDetail', customerDetails.threatServiceReport.header);
                    component.set('v.overview', customerDetails.threatServiceReport.overview);
                    if (customerDetails.threatServiceReport.overview.incident_status_summary == undefined) {
                        document.getElementById('threatTrendPieDiv').style.display = 'none';
                    }
                    if (customerDetails.threatServiceReport.overview.incident_status == undefined) {
                        document.getElementById('threatTrendLineDiv').style.display = 'none';
                    }
                    if (
                        customerDetails.threatServiceReport.overview.incident_status_summary == undefined &&
                        customerDetails.threatServiceReport.overview.incident_status == undefined
                    ) {
                        document.getElementById('threatTrendDiv').style.display = 'none';
                    }

                    if (customerDetails.threatServiceReport.not_recommended_exclusions != undefined) {
                        component.set('v.notRecommendation', customerDetails.threatServiceReport.not_recommended_exclusions);
                        component.set(
                            'v.notRecommendationCopy',
                            customerDetails.threatServiceReport.not_recommended_exclusions.total_not_recommended_list
                        );
                    }
                    component.set('v.reportDate', customerDetails.reportDate);
                    component.set('v.threatAnalysis', customerDetails.threatServiceReport.threat_analysis);
                    if (customerDetails.threatServiceReport.threat_analysis.engine_vs_tp_fp == undefined) {
                        document.getElementById('engineTpFpDiv').style.display = 'none';
                    }
                    if (customerDetails.threatServiceReport.threat_analysis.engine_vs_protect_detect == undefined) {
                        document.getElementById('enginePDDiv').style.display = 'none';
                    }
                    if (customerDetails.threatServiceReport.threat_analysis.threat_type_vs_detect_protect == undefined) {
                        document.getElementById('threatPDDiv').style.display = 'none';
                    }
                    if (
                        customerDetails.threatServiceReport.threat_analysis.engine_vs_protect_detect == undefined &&
                        customerDetails.threatServiceReport.threat_analysis.threat_type_vs_detect_protect == undefined
                    ) {
                        document.getElementById('dtPtId').style.display = 'none';
                    }
                    if (customerDetails.threatServiceReport.threat_analysis.top_agents == undefined) {
                        document.getElementById('topAgentDiv').style.display = 'none';
                    }
                    if (customerDetails.threatServiceReport.threat_analysis.top_sites == undefined) {
                        document.getElementById('topSiteDiv').style.display = 'none';
                    }
                    if (
                        customerDetails.threatServiceReport.threat_analysis.top_sites == undefined &&
                        customerDetails.threatServiceReport.threat_analysis.top_agents == undefined
                    ) {
                        document.getElementById('SiteAndAgentDiv').style.display = 'none';
                    }
                    if (
                        customerDetails.threatServiceReport.threat_analysis.top_hashes == undefined &&
                        customerDetails.threatServiceReport.threat_analysis.top_application == undefined
                    ) {
                        document.getElementById('hashAndApplicationDiv').style.display = 'none';
                    }
                    if (customerDetails.threatServiceReport.threat_analysis.top_hashes == undefined) {
                        document.getElementById('hashDiv').style.display = 'none';
                    }
                    if (customerDetails.threatServiceReport.threat_analysis.top_application == undefined) {
                        document.getElementById('appDiv').style.display = 'none';
                    }
                    if (customerDetails.threatServiceReport.threat_analysis.top_noisy_hashes == undefined) {
                        document.getElementById('noisyHashDiv').style.display = 'none';
                    }

                    component.set('v.recommendations', customerDetails.threatServiceReport.recommendation);
                    component.set('v.recommendationsCopy', customerDetails.threatServiceReport.recommendation);
                    component.set('v.hasMultipleRecord', customerDetails.hasMultipleRecord);
                    component.set('v.chartColors', customerDetails.threatServiceReport.colors);
                    var threatsTrendPieChart = component.find('threatTrendpie').getElement().id;
                    this.threatsTrendChart(component, event, helper, threatsTrendPieChart);
                    var threatTrendLineChart = component.find('threatTrendLine').getElement().id;
                    this.threatsTrendLineChart(component, event, helper, threatTrendLineChart);
                    var engineVsTpFpChartContainer = component.find('engineVsTpFpChartContainer').getElement().id;
                    this.engineVsTpFpChart(component, event, helper, engineVsTpFpChartContainer);
                    var enginevsProtectDetectChartDiv = component.find('enginevsProtectDetectChart').getElement().id;
                    this.engineVsProtectDetectChart(component, event, helper, enginevsProtectDetectChartDiv, true);
                    var thretVsProtectDetectChartDiv = component.find('threatVsDetectChart').getElement().id;
                    this.engineVsProtectDetectChart(component, event, helper, thretVsProtectDetectChartDiv, false);
                    var topAgentChartDiv = component.find('topAgentChart').getElement().id;
                    this.singleBarChartTopAgent(component, event, helper, topAgentChartDiv, 'Top Agent');
                    var topSitesChartDiv = component.find('topSitesChart').getElement().id;
                    this.singleBarChart(component, event, helper, topSitesChartDiv, 'Top Sites', '#A0AAAD');
                    var topHashchartDiv = component.find('topHashChart').getElement().id;
                    this.singleBarChartTopHash(component, event, helper, topHashchartDiv, 'Top Hash');
                    var topApplicationchartDiv = component.find('topApplicationChart').getElement().id;
                    this.singleBarChart(component, event, helper, topApplicationchartDiv, 'Top Application', '#B99CF1');
                    var noisyHashCHartDiv = component.find('topNoisyHashChart').getElement().id;
                    var dataToPlot = component.get('v.threatAnalysis').top_noisy_hashes;
                    this.noisyHashChart(component, event, helper, noisyHashCHartDiv, dataToPlot);
                    component.set('v.selectDate', false);
                    component.set('v.selectCustName', false);
                }
            } else {
                var errors = response.getError();
                component.set('v.spinner', false);
            }
        });
        $A.enqueueAction(action);
    },
    sorting: function (component, event, helper, arr) {
        return arr;
    },

    // New UI development
    threatsTrendChart: function (component, event, helper, divName) {
        var threatTrend = component.get('v.overview').incident_status_summary;
        var colors = component.get('v.chartColors').threatTrends;
        var JSONData = [];
        for (var v in threatTrend) {
            switch (threatTrend[v].analyst_verdict) {
                case 'False_Positive':
                    JSONData.push({ name: 'False Positive', y: threatTrend[v].incident_status_count });
                    break;
                case 'True_Positive':
                    JSONData.push({ name: 'True Positive', y: threatTrend[v].incident_status_count });
                    break;
                case 'Suspicious':
                    JSONData.push({ name: 'Suspicious', y: threatTrend[v].incident_status_count });
                    break;
                default:
            }
        }

        var totalIncidents = JSONData.reduce(function (acc, point) {
            return acc + point.y;
        }, 0);

        var plot = new Highcharts.Chart(divName, {
            chart: {
                renderTo: divName,
                type: 'pie',
                plotBackgroundColor: null,
                backgroundColor: '#FFFFFF',
                options3d: {
                    enabled: true,
                    alpha: 45
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
                            .text('Total', centerX, centerY - 2)
                            .css({
                                textAlign: 'center',
                                fontSize: '13px',
                                color: '#000000',
                                fontWeight: '700'
                            })
                            .attr({
                                zIndex: 5
                            })
                            .add();

                        // Center the 'Total' label horizontally
                        this.totalLabel.attr({
                            x: centerX - this.totalLabel.getBBox().width * 0.5
                        });

                        // Create the numeric value label
                        this.numberLabel = this.renderer
                            .text(totalIncidents.toString(), centerX, centerY + 15)
                            .css({
                                textAlign: 'center',
                                fontSize: '13px',
                                fontWeight: '700',
                                color: '#000000'
                            })
                            .attr({
                                zIndex: 5
                            })
                            .add();

                        // Center the numeric value label horizontally
                        this.numberLabel.attr({
                            x: centerX - this.numberLabel.getBBox().width * 0.5
                        });
                    }
                }
            },
            exporting: {
                enabled: false
            },
            title: '',
            colors: [colors.server, colors.kubernet, colors.desktop, colors.laptop],
            tooltip: {
                formatter: function () {
                    // Convert the number to a string and remove the thousands separator
                    var formattedNumber = this.point.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '');
                    return '<b>' + formattedNumber + ' (' + Highcharts.numberFormat(this.point.percentage, 1) + '%)</b>';
                },
                shared: true,
                useHTML: true,
                backgroundColor: '#000000',
                style: {
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false
                    },
                    borderWidth: 1,
                    cursor: 'pointer',
                    innerSize: '80%',
                    depth: 25,
                    style: {
                        shadow: true
                    },
                    point: {
                        events: {
                            legendItemClick: function () {
                                return false;
                            }
                        }
                    }
                }
            },
            credits: {
                enabled: false
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                itemMarginBottom: 5,
                symbolPadding: 10,
                x: 4,
                useHTML: true,
                itemStyle: {
                    color: '#262626',
                    fontFamily: 'LatoFont',
                    fontSize: '11px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '16px',
                    letterSpacing: '0.5px',
                    textTransform: 'capitalize'
                },
                labelFormatter: function () {
                    return `<span style="min-width: 100%; width: 100%; display:inline-block;">
                                <span title="${this.name}" style="float:left;width: 70px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                                    ${this.name}
                                </span>
                                <span style="float:right">
                                    ${this.percentage.toFixed(2)}%
                                </span>
                            </span>`;
                }
            },
            series: [
                {
                    showInLegend: true,
                    type: 'pie',
                    data: JSONData
                }
            ]
        });
    },
    threatsTrendLineChart: function (component, event, helper, divName) {
        var data = component.get('v.overview').incident_status;
        var falsePositiveData = [];
        var suspiciousData = [];
        var truePositiveData = [];
        var totalData = [];
        for (var i in data) {
            falsePositiveData.push({ name: data[i].createdAtDate, y: data[i].False_Positive });
            suspiciousData.push({ name: data[i].createdAtDate, y: data[i].Suspicious });
            truePositiveData.push({ name: data[i].createdAtDate, y: data[i].True_Positive });
            totalData.push({ name: data[i].createdAtDate, y: data[i].Totals });
        }
        var plot = new Highcharts.chart(divName, {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'spline'
            },
            title: '',
            credits: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            xAxis: {
                title: {
                    text: ''
                },
                type: 'category',
                tickInterval: 10
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                spline: {
                    dataLabels: {
                        enabled: false,
                        format: '{point.y:.0f}'
                    },
                    marker: {
                        enabled: false
                    },
                    enableMouseTracking: true
                }
            },
            tooltip: {
                formatter: function () {
                    // Convert the number to a string and remove the thousands separator
                    var formattedNumber = this.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '');
                    return '<b>' + this.series.name + '</b>: ' + formattedNumber;
                },
                crosshairs: true,
                useHTML: true,
                backgroundColor: '#000000',
                style: {
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                }
            },
            series: [
                {
                    name: 'False Positive',
                    color: '#7B3FF2',
                    data: falsePositiveData
                },
                {
                    name: 'Suspicious',
                    color: '#2495FE',
                    data: suspiciousData
                },
                {
                    name: 'True Positive',
                    color: '#000000',
                    data: truePositiveData
                },
                {
                    name: 'Total',
                    color: '#A0AAAD',
                    data: totalData
                }
            ]
        });
    },
    engineVsTpFpChart: function (component, event, helper, divName) {
        var plotData = component.get('v.threatAnalysis').engine_vs_tp_fp;
        var colors = component.get('v.chartColors').enginesVsTpFp;
        var category = [];
        var truePositive = [];
        var falsePositive = [];
        var suspicious = [];
        var undefined = [];
        for (var i in plotData) {
            category.push(plotData[i].engines);
            truePositive.push(plotData[i].True_Positive);
            falsePositive.push(plotData[i].False_Positive);
            suspicious.push(plotData[i].Suspicious);
            undefined.push(plotData[i].Undefined);
        }
        var plot = new Highcharts.chart(divName, {
            chart: {
                type: 'bar',
                height: 317,
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: category,
                labels: {
                    useHTML: true,
                    format: '<div class="bar-label engineTpFpDiv_lable" title="{value}">{value}</div>',
                    padding: 9
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                labels: {
                    useHTML: true,
                    padding: 9
                },
                stackLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.total;
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b> ' + this.x + '</b>  : ' + this.series.name + ' - ' + this.y;
                },
                useHTML: true,
                backgroundColor: '#000000',
                style: {
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                }
            },
            colors: [colors.truePositive, colors.falsePositive, colors.suspicious],
             legend: {
                align: 'right',          // Aligns the legend to the right
                verticalAlign: 'top',   // Aligns the legend to the top       
                x: 0,                    // Horizontal offset
                y: -16,                     // Vertical offset
       
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    borderColor: 'none',
                    pointPadding: 0,
                    pointWidth: 9,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [
                { name: 'True Positive', color: colors.suspicious, data: truePositive, legendIndex: 2 },
                { name: 'Suspicious', color: colors.falsePositive, data: suspicious, legendIndex: 3 },
                { name: 'False Positive', color: colors.truePositive, data: falsePositive, legendIndex: 1}
            ]
        });
    },
    engineVsProtectDetectChart: function (component, event, helper, divName, isEngine) {
        var plotData;
        var colors = component.get('v.chartColors').protectVsDetect;
        var category = [];
        var protect = [];
        var detect = [];
        if (isEngine) {
            plotData = component.get('v.threatAnalysis').engine_vs_protect_detect;
            for (var i in plotData) {
                category.push(plotData[i].engines);
                protect.push(plotData[i].protect);
                detect.push(plotData[i].detect);
            }
        } else {
            plotData = component.get('v.threatAnalysis').threat_type_vs_detect_protect;
            for (var i in plotData) {
                category.push(plotData[i].classification);
                protect.push(plotData[i].protect);
                detect.push(plotData[i].detect);
            }
        }
        var plot = new Highcharts.chart(divName, {
            chart: {
                type: 'bar',
                height: 317,
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: category,
                labels: {
                    useHTML: true,
                    format: '<div class="bar-label engine_protect_detect" title="{value}">{value}</div>',
                    style: {
                        color: '#757575',
                        fontFamily: 'LatoFont',
                        fontSize: '11px',
                        fontStyle: 'normal',
                        fontWeight: '400',
                        lineHeight: '16px',
                        letterSpacing: '0.5px'
                    },
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                stackLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.total;
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b> ' + this.x + '</b>  : ' + this.series.name + ' - ' + this.y;
                },
            	useHTML: true,
                backgroundColor: '#000000',
                style: {
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                }
            },
            colors: [colors.protect, colors.detect],
            legend: {
                align: 'right',          // Aligns the legend to the right
                verticalAlign: 'top',   // Aligns the legend to the top       
                x: 0,                    // Horizontal offset
                y: -16,             // Vertical offset
                reversed: true,
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    borderColor: 'none',
                    pointWidth: 9,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [
                { name: 'Protect', data: protect, index: 1},
                { name: 'Detect', data: detect, index: 0}
            ]
        });
    },
    singleBarChart: function (component, event, helper, divName, chartType, barColor) {
        var data, colors, seriesName;
        var category = [];
        var statusCount = [];
        if (chartType == 'Top Agent') {
            data = component.get('v.threatAnalysis').top_agents;
            colors = component.get('v.chartColors').analysisCharts.barColorTopAgent;
            seriesName = 'Threats';
            for (var i in data) {
                category.push(data[i].agent_uuid);
                statusCount.push(data[i].agents_threats);
            }
        } else if (chartType == 'Top Sites') {
            data = component.get('v.threatAnalysis').top_sites;
            colors = component.get('v.chartColors').analysisCharts.barColorTopSites;
            seriesName = 'Threats';
            for (var i in data) {
                category.push(data[i].siteName);
                statusCount.push(data[i].sites_count);
            }
        } else if (chartType == 'Top Hash') {
            data = component.get('v.threatAnalysis').top_hashes;
            colors = component.get('v.chartColors').analysisCharts.barColorTopHash;
            seriesName = 'Threats';
            for (var i in data) {
                category.push(data[i].threatName);
                statusCount.push(data[i].count_sha);
            }
        } else if (chartType == 'Top Application') {
            data = component.get('v.threatAnalysis').top_application;
            if (data == undefined || data.length == 0) {
                return;
            }
            colors = component.get('v.chartColors').analysisCharts.barColorTopApplication;
            seriesName = 'Agent UUID';
            for (var i in data) {
                category.push(data[i].applicationName);
                statusCount.push(data[i].endpointsCount);
            }
        }
        var plot = new Highcharts.chart(divName, {
            chart: {
                type: 'bar',
                height: 186,
            },
            title: '',
            xAxis: {
                categories: category,
                title: {
                    text: ''
                },
                gridLineWidth: 0,
                lineWidth: 0,
                labels: {
                    useHTML: true,
                    formatter: function () {
                        var label = this.value;
                        if (label.length > 30) {
                            label = label.substring(0, 30) + '...';
                        }
                        return '<div class="bar-label top_sites_lable" title="'+label+'">' + label + '</div>';
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                gridLineWidth: 1
            },
            legend: {
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'top',
                x: 0,
                y: -16 ,
                itemStyle: {
                    color: '#757575',
                    fontFamily: 'LatoFont',
                    fontSize: '11px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '16px',
                    letterSpacing: '0.5px',
                    textTransform: 'capitalize'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b>  <br/>' + this.series.name + ': ' + this.y;
                },
                useHTML: true,
                backgroundColor: '#000000',
                style: {
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            // Formatting the label value without thousands separator
                            return Highcharts.numberFormat(this.y, 0, '', '');
                        }
                    },
                    groupPadding: 0
                },
                series: {
                    pointWidth: 9,
                    pointPadding: 0,
                    borderWidth: 0,
                    color : barColor
                }
            },
            colors: [colors],
            credits: {
                enabled: false
            },
            series: [
                {
                    showInLegend: true,
                    pointWidth: 9,
                    name: seriesName,
                    data: statusCount
                }
            ]
        });
    },
    singleBarChartTopAgent: function (component, event, helper, divName, chartType) {
        var data, colors, seriesName;
        var category = [];
        var statusCount = [];

        data = component.get('v.threatAnalysis').top_agents;
        colors = component.get('v.chartColors').analysisCharts.barColorTopAgent;
        seriesName = 'Threats';
        for (var i in data) {
            category.push(data[i].agent_uuid);
            statusCount.push(data[i].agents_threats);
        }

        var plot = new Highcharts.chart(divName, {
            chart: {
                type: 'bar',
                 height: 186,
            },
            title: '',
            xAxis: {
                categories: category,
                title: {
                    text: ''
                },
                gridLineWidth: 0,
                lineWidth: 0,
                labels: {
                    useHTML: true,
				    padding: 9,                
                    formatter: function () {
                        var label = this.value;
                        if (label.length > 20) {
                            label = label.substring(0, 20) + '...';
                        }
                        return '<div class="bar-label" title="'+label+'">' + label + '</div>';
                    }
                }
            },
            yAxis: {
                min: 0,
				labels: {
                    useHTML: true,
                    padding: 9
                },
                title: {
                    text: ''
                },
                gridLineWidth: 1
            },
            legend: {
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'top',
                x: 0,
                y: -16 ,
                itemStyle: {
                    color: '#757575',
                    fontFamily: 'LatoFont',
                    fontSize: '11px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '16px',
                    letterSpacing: '0.5px',
                    textTransform: 'capitalize'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b>  <br/>' + this.series.name + ': ' + this.y;
                },
                useHTML: true,
                backgroundColor: '#000000',
                style: {
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            // Formatting the label value without thousands separator
                            return Highcharts.numberFormat(this.y, 0, '', '');
                        }
                    },
                    groupPadding: 0
                },
                series: {
                    pointWidth: 9,
                    pointPadding: 0,
                    borderWidth: 0,
                    color: '#A0AAAD'
                }
            },
            colors: [colors],
            credits: {
                enabled: false
            },
            series: [
                {
                    showInLegend: true,
                    name: seriesName,
                    data: statusCount
                }
            ]
        });
    },
    singleBarChartTopHash: function (component, event, helper, divName, chartType) {
        var data, colors, seriesName;
        var category = [];
        var statusCount = [];

        data = component.get('v.threatAnalysis').top_hashes;
        colors = component.get('v.chartColors').analysisCharts.barColorTopHash;
        seriesName = 'Threats';
        for (var i in data) {
            category.push(data[i].threatName);
            statusCount.push(data[i].count_sha);
        }

        var plot = new Highcharts.chart(divName, {
            chart: {
                type: 'bar',
                height: 186,
            },
            title: '',
            xAxis: {
                categories: category,
                title: {
                    text: ''
                },
                gridLineWidth: 0,
                lineWidth: 0,
                labels: {
                    useHTML: true,
					padding: 9,
                    formatter: function () {
                        var label = this.value;
                        if (label.length > 30) {
                            label = label.substring(0, 30) + '...';
                        }
                        return '<div class="bar-label" title="'+label+'">' + label + '</div>';
                    }
                }
            },
            yAxis: {
                min: 0,
                labels: {
                    useHTML: true,
                    padding: 9
                },
                title: {
                    text: ''
                },
                gridLineWidth: 1
            },
            legend: {
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'top',
                x: 0,
                y: -16 ,
                itemStyle: {
                    color: '#757575',
                    fontFamily: 'LatoFont',
                    fontSize: '11px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '16px',
                    letterSpacing: '0.5px',
                    textTransform: 'capitalize'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b>  <br/>' + this.series.name + ': ' + this.y;
                },
                useHTML: true,
                backgroundColor: '#000000',
                style: {
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            // Formatting the label value without thousands separator
                            return Highcharts.numberFormat(this.y, 0, '', '');
                        }
                    },
                    groupPadding: 0
                },
                series: {
                    pointWidth: 9,
                    pointPadding: 0,
                    borderWidth: 0,
                    color: '#A0AAAD'
                }
            },
            colors: [colors],
            credits: {
                enabled: false
            },
            series: [
                {
                    showInLegend: true,
                    name: seriesName,
                    data: statusCount
                }
            ]
        });
    },
    noisyHashChart: function (component, event, helper, divName, dataToPlot) {
        var listOfDate = [];
        var listOfSha = [];
        var shaToLinkMap = {};
        for (var i in dataToPlot) {
            if (!listOfDate.includes(dataToPlot[i].date)) {
                listOfDate.push(dataToPlot[i].date);
            }
            if (!listOfSha.includes(dataToPlot[i].threatName)) {
                listOfSha.push(dataToPlot[i].threatName);
                if (dataToPlot[i].hash_link !== undefined && dataToPlot[i].hash_link !== '') {
                    shaToLinkMap[dataToPlot[i].threatName] = dataToPlot[i].hash_link;
                }
            }
        }
        var dateToShaMap = new Map();
        for (var ld in listOfDate) {
            var shaList = [];
            for (var v in dataToPlot) {
                if (dataToPlot[v].date == listOfDate[ld]) {
                    var existingThreatIndex = shaList.findIndex(item => item.threatName === dataToPlot[v].threatName);
                    if (existingThreatIndex !== -1) {
                        shaList[existingThreatIndex].count += dataToPlot[v].hashes_by_date;
                    } else {
                        shaList.push({ threatName: dataToPlot[v].threatName, count: dataToPlot[v].hashes_by_date, link: dataToPlot[v].hash_link });
                    }
                }
            }
            dateToShaMap.set(listOfDate[ld], shaList);
        }
        var plotDataSeries = [];
        dateToShaMap.forEach(function (value, key) {
            for (var d in listOfDate) {
                if (listOfDate[d] == key) {
                    for (var val in value) {
                        for (var s in listOfSha) {
                            if (listOfSha[s] == value[val].threatName) {
                                plotDataSeries.push({ x: parseInt(d), y: parseInt(s), value: value[val].count, description: value[val].link });
                            }
                        }
                    }
                }
            }
        });
        var plot = new Highcharts.chart(divName, {
            chart: {
                type: 'heatmap',
                marginTop: 40,
                marginBottom: 80,
                plotBorderWidth: 1,
                plotBorderColor: '#FFFFFF'
            },
            credits: {
                enabled: false
            },

            title: {
                text: ''
            },

            xAxis: {
                categories: listOfDate,
                labels: {
                    rotation: 0, // Keep labels horizontal
                    align: 'center', // Center-align labels (if needed)
                    style: {
                        textOverflow: 'none', // Prevent the text from being cut off
                        whiteSpace: 'normal' // Allow text to wrap within the label
                    }
                },
                tickInterval: 10
            },

            yAxis: {
                categories: listOfSha,
                title: null,
                reversed: false,
                labels: {
                    useHTML: true,
                    formatter: function () {
                        var shaName = this.value;
                        var link = shaToLinkMap[shaName];

                        var truncatedShaName = shaName.length > 25 ? shaName.substring(0, 25) + '…' : shaName;
                        if (link) {
                            return (
                                '<a href="' +
                                link +
                                '" target="_blank" class="bar-label" ' +
                                'style="display: block; text-align: left; text-decoration: none; color: inherit; ' +
                                'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' +
                                truncatedShaName +
                                '</a>'
                            );
                        } else {
                            return (
                                '<div class="bar-label hashe-label" title="'+truncatedShaName+'" style="text-align: left; overflow: hidden; ' +
                                'white-space: nowrap; text-overflow: ellipsis;">' +
                                truncatedShaName +
                                '</div>'
                            );
                        }
                    }
                }
            },
            colorAxis: {
                min: 0,
                stops: [
                    [0.0, '#FDEBE1'], // Lightest color
                    [0.01, '#FBD5C7'], // Darker color earlier for 0.01
                    [0.1, '#FAD8CD'],
                    [0.2, '#F8CEC3'],
                    [0.3, '#F6C4B9'],
                    [0.4, '#F4BAAF'], // Midpoint is now darker
                    [0.6, '#F2B0A5'],
                    [0.7, '#F0A69B'],
                    [0.8, '#EE9C91'],
                    [0.9, '#EC9287'],
                    [1.0, '#A84004'] // Darkest color
                ]
            },
            legend: {
                align: 'right',
                layout: 'horizontal',
                verticalAlign: 'top',
                margin: 0,
                x: 5, 
                y: -24,
                symbolHeight: 20,
                textColor: '#757575'
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + listOfDate[this.point.x] + '</b>  <br/>' + listOfSha[this.y] + ' &nbsp; : &nbsp; &nbsp; &nbsp;' + this.point.value;
                },
                useHTML: true,
                backgroundColor: '#000000',
                style: {
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                }
            },
            series: [
                {
                    name: '',
                    borderWidth: 0.5,
                    borderColor: '#FFFFFF',
                    data: plotDataSeries,
                    dataLabels: {
                        enabled: false
                    }
                }
            ],
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    pointWidth: 9,
                    events: {
                        click: function (event) {
                            console.log('click ', this);
                            console.log('click ', event.point.index);
                            console.log('desc ', event.point.description);
                        }
                    }
                }
            }
        });
    },
    convertArrayOfObjectsToCSV: function (objectRecords, recordType) {
        var csvStringResult, counter, keys, columnDivider, lineDivider;
        if (objectRecords == null || !objectRecords.length) {
            return null;
        }
        columnDivider = ',';
        lineDivider = '\n';
        if (recordType == 'NotRecAction') {
            keys = ['createdDate', 'description', 'reporter', 'value'];
        } else {
            keys = ['Name', 'Description'];
        }
        csvStringResult = '';
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
            'Threat Report - ' + component.get('v.headerDetail').Account_Name + ' - ' + component.get('v.reportDate') + ' - ' + sectionName + '.csv';
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_self';
        hiddenElement.download = fileName;
        document.body.appendChild(hiddenElement);
        hiddenElement.click();
    }
});