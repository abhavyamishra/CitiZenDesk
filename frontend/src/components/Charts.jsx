import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';

// 1. Labels are hardcoded as requested.
const DEPARTMENT_LABELS = ['Water', 'Garbage', 'Road'];
const STATUS_LABELS = ['Pending', 'Completed', 'Processing', 'Closed'];
const URGENCY_LABELS = ['Critical', 'High', 'Medium', 'Low'];

export const Charts = () => {
    // Get the pre-calculated stats object from your Redux store
    const stats = useSelector(state => state.stats.data) || {};

    // --- Process Data for Charts ---

    // For Department and Urgency, we just map the data to our fixed labels
    const departmentSeries = DEPARTMENT_LABELS.map(label => stats.departmentCounts?.[label.toLowerCase()] || 0);
    const urgencySeries = URGENCY_LABELS.map(label => stats.urgencyCounts?.[label.toLowerCase()] || 0);
    const avgResolutionTime = stats.avgResolutionTimeHours ? `${stats.avgResolutionTimeHours} hours` : 'N/A';
    const complaintStatus = stats.complaintStatus|| {};

    // For Status, we calculate the main totals by summing sub-categories
    const statusSeries = useMemo(() => {
        
        //const mainStatus = stats.statusCounts || {};

        const pendingTotal = (complaintStatus.active || 0) + (complaintStatus.elapsed || 0);
        const completedTotal = (complaintStatus.completed || 0) + (complaintStatus.completed_late || 0);
        const processingTotal = complaintStatus.processing || 0;
        const closedTotal = complaintStatus.closed || 0;

        return [pendingTotal, completedTotal, processingTotal, closedTotal];
    }, [stats]);


    // --- Chart Options ---

    // Options for the simple pie charts
    const pieOptions = (title, labels) => ({
        chart: { type: 'pie' },
        title: { text: title, align: 'center' },
        labels: labels,
        legend: { position: 'bottom' },
        dataLabels: { formatter: (val) => `${val.toFixed(1)}%` },
    });

    // Options for the Status donut chart with the custom hover tooltip
    const statusChartOptions = {
  chart: { type: 'donut' },
  title: { text: 'Complaint Status', align: 'center' },
  labels: STATUS_LABELS,
  legend: { position: 'bottom' },
  dataLabels: { enabled: false },
  tooltip: {
    enabled: true,
    fillSeriesColor: false,
    custom: function({ series, seriesIndex, w }) {
      const total = series[seriesIndex];
      const label = w.globals.labels[seriesIndex];
      let breakdownHtml = '';

      if (label === 'Pending') {
        breakdownHtml = `
          <div style="font-weight:600;">Breakdown:</div>
          <div>- Active: ${complaintStatus.active || 0}</div>
          <div>- Elapsed: ${complaintStatus.elapsed || 0}</div>
        `;
      } else if (label === 'Completed') {
        breakdownHtml = `
          <div style="font-weight:600;">Breakdown:</div>
          <div>- On-Time: ${complaintStatus.completed || 0}</div>
          <div>- Late: ${complaintStatus.completed_late || 0}</div>
        `;
      }

      return `
        <div style="padding:8px;">
          <strong>${label}</strong>: ${total}
          <div style="margin-top:6px;">${breakdownHtml}</div>
        </div>
      `;
    }
  },
};


    return (
        <div className="p-4 bg-muted/40 ">
            <h2 className="text-xl font-bold">Complaint Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Chart 1: Departments */}
                <div className="p-4 bg-card rounded-lg shadow-md">
                    <Chart
                        options={pieOptions('Complaints by Department', DEPARTMENT_LABELS)}
                        series={departmentSeries}
                        type="pie"
                        width="100%"
                    />
                </div>

                {/* Chart 2: Status with Hover Tooltip */}
                <div className="p-4 bg-card rounded-lg shadow-md">
                    <Chart
                        options={statusChartOptions}
                        series={statusSeries}
                        type="donut"
                        width="100%"
                    />
                </div>

                {/* Chart 3: Urgency */}
                <div className="p-4 bg-card rounded-lg shadow-md">
                    <Chart
                        options={pieOptions('Complaints by Urgency', URGENCY_LABELS)}
                        series={urgencySeries}
                        type="pie"
                        width="100%"
                    />
                </div>

               
                <div className="p-6 bg-card rounded-lg shadow-md flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-semibold text-muted-foreground">Average Resolution Time</h3>
                    <p className="text-3xl font-bold text-primary mt-2">{avgResolutionTime}</p>
                </div>

            </div>
        </div>
    );
};