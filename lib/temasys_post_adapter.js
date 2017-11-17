var isUsingTemasysPlugin = false;
if (!!AdapterJS && !!AdapterJS.webRTCReady) {
  AdapterJS.webRTCReady(function (isUsingPlugin) {
    isUsingTemasysPlugin = isUsingPlugin;
    console.debug('isUsingTemasysPlugin: ', isUsingTemasysPlugin);
  });
}
