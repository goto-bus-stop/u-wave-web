function isSupported() {
  return typeof Notification !== 'undefined' && !!Notification.requestPermission;
}

export function requestPermission() {
  if (!isSupported() || Notification.permission === 'denied') {
    return Promise.reject();
  }
  if (Notification.permission === 'granted') {
    return Promise.resolve();
  }
  return Notification.requestPermission().then((result) => {
    if (result === 'denied' || result === 'default') {
      return Promise.reject();
    }
    return null;
  });
}

/**
 * Show a desktop notification. See https://mdn.io/notifications_api.
 *
 * `options` can also contain a property `timeout`, which will automatically
 * close the notification after the specified time in milliseconds.
 */
export function notify(title, options) {
  return requestPermission().then(() => {
    const notif = new Notification(title, options);

    notif.on('click', () => notif.close());

    if (options.timeout) {
      const timeout = setTimeout(
        () => notif.close(),
        options.timeout
      );

      notif.on('click', () => clearTimeout(timeout));
    }
  }).catch(() => {
    // Could not show notification, but that's ok ¯\_(ツ)_/¯
  });
}
