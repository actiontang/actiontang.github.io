
// Part of https://todbot.github.io/blink1-webhid/

document.getElementById('start-button').addEventListener('click', handleConnectClick);
document.getElementById('stop-button').addEventListener('click', handleDisconnectClick);

async function handleConnectClick() {
    let acolor = [ 255, 0, 255 ];  // purple
    let device = await openDevice();
    await fadeToColor(device, acolor );
}

async function handleDisconnectClick() {
    let acolor = [ 0, 0, 0 ]; // off
    let device = await openDevice();
    if( !device ) return;
    await fadeToColor(device, acolor);
    await device.close();
}

async function openDevice() {
    const vendorId = 0x0457; // blink1 vid
    const productId = 0x1905;  // blink1 pid
    
    const filters = [
  {
    vendorId: 0x0457, // Nintendo Co., Ltd
    productId: 0x1905 // Joy-Con Left
  },
  {
    vendorId: 0x0000, // Nintendo Co., Ltd
    productId: 0x00 // Joy-Con Right
  }
];
    

    const device_list = await navigator.hid.getDevices();

    let device = device_list.find({ filters });

    if (1) 
    {
        // this returns an array now
        let devices = await navigator.hid.requestDevice({ filters } );
        console.log("devices:",devices);
        device = devices[0];
        if( !device ) return null;
    }

    if (!device.opened) {
        await device.open();
    }
    console.log("device opened:",device);
    return device;
}

async function fadeToColor(device, [r, g, b] ) {
    if(!device) return;
    const reportId = 1;
    const data = Uint8Array.from([0x63, r, g, b, 0x00, 0x10, 0x00, 0x00 ]);
    try {
        await device.sendFeatureReport(reportId, data);
    } catch (error) {
        console.error('fadeToColor: failed:', error);
    }
}

