export const wordCloudOptions = {
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
    enableTooltip: true,
    deterministic: true,
    enableOptimizations: true,
    fontFamily: 'impact',
    fontSizes: [20, 22],
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: 3,
    rotations: 1,
    rotationAngles: [0, 90], 
    scale: 'sqrt',
    spiral: 'archimedean',
    transitionDuration: 1000,
}

export const timelineOptions = {
    height: '100%',
    autoResize: true,
    stack: true,
    orientation: 'both',
    zoomKey: 'ctrlKey',
    moveable: true,
    zoomable: true,
    horizontalScroll: true,
    verticalScroll: true,
    zoomFriction: 30,
    zoomMin: 1000 * 60 * 60 * 24 * 7, // 7 days
    /* zoomMax: 1000 * 60 * 60 * 24 * 30 * 3, */ // 3months
    /* cluster: {
      titleTemplate: 'Cluster containing {count} events.\nZoom in to see the individual events.',
      showStipes: false,
      clusterCriteria: (firstItem, secondItem) => {
        return (  (typeof  firstItem.rawData.type == 'undefined' && typeof  secondItem.rawData.type == 'undefined'  && firstItem.rawData.law_firm_id === secondItem.rawData.law_firm_id)  || (typeof  firstItem.rawData.type !== 'undefined' && typeof  secondItem.rawData.type !== 'undefined'  && firstItem.rawData.lawfirm === secondItem.rawData.lawfirm ) || ( firstItem.rawData.repID > 0 && secondItem.rawData.repID > 0 && firstItem.rawData.repID == secondItem.rawData.repID))
      }
    },  */
    cluster: {
      maxItems: 6,
      titleTemplate: 'Zoom in to see the individual item.',
      showStipes: false,
      /* clusterCriteria: (firstItem, secondItem) => {
          return  firstItem.rawData.assignee.toString().toLowerCase() == secondItem.rawData.assignee.toString().toLowerCase()
      },
      fitOnDoubleClick: false */
    }
}