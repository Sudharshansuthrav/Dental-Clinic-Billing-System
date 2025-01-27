document.getElementById('billingForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const patientName = document.getElementById('patientName').value;
    const service = document.getElementById('service').value;

    const serviceDetails = {
        "Cleaning": 50,
        "Filling": 100,
        "Root Canal": 300,
        "Extraction": 150
    };

    if (service) {
        const serviceName = service.split(' - ')[0];
        const serviceCost = serviceDetails[serviceName];

        const billOutput = `
            <h2>Bill Summary</h2>
            <p><strong>Patient Name:</strong> ${patientName}</p>
            <p><strong>Service Rendered:</strong> ${serviceName}</p>
            <p><strong>Total Amount Due:</strong> $${serviceCost}</p>
        `;

        document.getElementById('billOutput').innerHTML = billOutput;
    } else {
        alert('Please select a service.');
    }

    // Clear form fields after submission
    document.getElementById('billingForm').reset();
});