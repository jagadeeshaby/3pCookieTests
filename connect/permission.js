if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.protocol = 'https:';
  }


  navigator.permissions.query({name: 'storage-access'}).then(res => {
    if (res.state === 'granted') {
      // Permission has already been granted
      // You can request storage access without any user gesture
      rSA();
    } else if (res.state === 'prompt') {
      // Requesting storage access requires user gesture
      // For example, clicking a button
      const btn = document.createElement("button");
      btn.textContent = "Grant access";
      btn.addEventListener('click', () => {
        // Request storage access
        rSA();
      });
      document.body.appendChild(btn);
    }
  });
  
  function rSA() {
    if ('requestStorageAccess' in document) {
      document.requestStorageAccess().then(
        (res) => {
          // Use storage access

          initSharedWorker();
        },
        (err) => {
          // Handle errors
        }
      );
    }
  }


  initSharedWorker();
