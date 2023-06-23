function doThingsWithCookies() {
    initSharedWorker();
}
  
  async function handleCookieAccess() {
    if (document.hasStorageAccess === null) {
      // This browser doesn't support the Storage Access API
      // so let's just hope we have access!
      doThingsWithCookies();
    } else {
      const hasAccess = await document.hasStorageAccess();
      if (hasAccess) {
        // We have access to unpartitioned cookies, so let's go
        doThingsWithCookies();
      } else {
        // Check whether unpartitioned cookie access has been granted
        // to another same-site embed
        const permission = await navigator.permissions.query({
          name: "storage-access",
        });
  
        if (permission.state === "granted") {
          // If so, you can just call requestStorageAccess() without a user interaction,
          // and it will resolve automatically.
          await document.requestStorageAccess();
          doThingsWithCookies();
        } else if (permission.state === "prompt") {
          // Need to call requestStorageAccess() after a user interaction
          const btn = document.createElement("button");
          btn.textContent = "Grant access";
         
          btn.addEventListener("click", async () => {
            try {
              await document.requestStorageAccess();
              doThingsWithCookies();
            } catch (err) {
              // If there is an error obtaining storage access.
              console.error(`Error obtaining storage access: ${err}.
                            Please sign in.`);
            }
          });
          document.body.appendChild(btn);

        } else if (permission.state === "denied") {
          // User has denied unpartitioned cookie access, so we'll
          // need to do something else
        }
      }
    }
  }

handleCookieAccess();
  