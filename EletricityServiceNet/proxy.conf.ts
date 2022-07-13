const PROXY_CONFIG = [
  {
    context: [
      '/howell/ver10/data_service/',
      '/api/howell/ver10/aiop_service/',
      '/video/wsplayer/',
      '/amap/',
      '/api/howell/ver10/businesshall_service/',
    ],
    //target: 'http://garbage01.51hws.cn',
    target: 'http://192.168.21.122:9400',
    changeOrigin: true,
    secure: false,
  },
];

module.exports = PROXY_CONFIG;
