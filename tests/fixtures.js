const fixtures = {
    alerts: {
        'receiver': 'monitoring/default-receiver/matrix',
        'status': 'firing',
        'alerts': [{
            'status': 'firing',
            'labels': {
                'alertname': 'DiskSpace',
                'device': '/dev/sda1',
                'fstype': 'ext4',
                'host': 'foo',
                'instance': '1.2.3.4',
                'job': 'node',
                'mountpoint': '/'
            },
            'annotations': {
                'description': 'Filesystem low',
                'summary': 'Instance 1.2.3.4 filesystem usage is dangerously high'
            },
            'startsAt': '2018-12-05T23:38:43.700314857Z',
            'endsAt': '0001-01-01T00:00:00Z',
            'generatorURL': 'http://1.2.3.4/graph?1'
        }, {
            'status': 'firing',
            'labels': {
                'alertname': 'DiskSpace',
                'device': '/dev/sda1',
                'fstype': 'ext4',
                'host': 'foo',
                'instance': '1.2.3.4',
                'job': 'node',
                'mountpoint': '/'
            },
            'annotations': {
                'description': 'Filesystem low',
                'summary': 'Instance 1.2.3.4 filesystem usage is dangerously high'
            },
            'startsAt': '2018-12-05T23:38:43.700314857Z',
            'endsAt': '0001-01-01T00:00:00Z',
            'generatorURL': 'http://1.2.3.4/graph?1'
        }],
        'groupLabels': {},
        'commonLabels': {
            'job': 'node'
        },
        'commonAnnotations': {},
        'externalURL': 'http://1.2.3.4',
        'version': '4',
        'groupKey': '{}:{}'
    }
}

module.exports = fixtures
