    document.getElementById("registrationForm").addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData();
      formData.append("firstname", document.getElementById("firstname").value);
      formData.append("lastname", document.getElementById("lastname").value);
      formData.append("father", document.getElementById("father").value);
      formData.append("dob", document.getElementById("dob").value);
      formData.append("gender", document.getElementById("gender").value);
      formData.append("email", document.getElementById("email").value);
      formData.append("phone", document.getElementById("phone").value);
      formData.append("course", document.getElementById("course").value);
      formData.append("year", document.getElementById("year").value);
      formData.append("admissiondate", document.getElementById("admissiondate").value);

      fetch("https://script.google.com/macros/s/AKfycbyZeISLNGnNBJTrxUZhnfjB5nBCMpBZaVxpM7P9bsQT4UkrQ5GgN9-j1zPXg1U8EW_L/exec", {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          const resBox = document.getElementById("response");
          if (data.status === "success") {
            resBox.innerHTML = `<span class="text-success">✅ ${data.message} <br> Your UID: <strong>${data.UID}</strong></span>`;
            document.getElementById("registrationForm").reset();
          } else {
            resBox.innerHTML = `<span class="text-danger">❌ ${data.message}</span>`;
          }
        })
        .catch(error => {
          console.error("Error:", error);
          document.getElementById("response").innerHTML = `<span class="text-danger">Something went wrong. Please try again.</span>`;
        });
    });
