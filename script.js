// Dental Clinic Treatment Billing System
document.addEventListener('DOMContentLoaded', function() {
    // Treatment data - organized by category
    const treatmentData = {
        general: [
            { name: 'Dental Checkup', price: 50 },
            { name: 'Teeth Cleaning', price: 80 },
            { name: 'Dental Filling', price: 120 },
            { name: 'Root Canal Treatment', price: 500 }
        ],
        cosmetic: [
            { name: 'Teeth Whitening', price: 250 },
            { name: 'Dental Veneers', price: 950 },
            { name: 'Dental Bonding', price: 300 },
            { name: 'Smile Makeover', price: 1500 }
        ],
        orthodontic: [
            { name: 'Traditional Braces', price: 3500 },
            { name: 'Clear Aligners', price: 4500 },
            { name: 'Retainers', price: 300 },
            { name: 'Orthodontic Consultation', price: 100 }
        ],
        surgical: [
            { name: 'Tooth Extraction', price: 150 },
            { name: 'Wisdom Tooth Removal', price: 350 },
            { name: 'Dental Implant', price: 1800 },
            { name: 'Bone Grafting', price: 700 }
        ],
        pediatric: [
            { name: 'Child Dental Exam', price: 40 },
            { name: 'Fluoride Treatment', price: 60 },
            { name: 'Dental Sealants', price: 45 },
            { name: 'Space Maintainers', price: 250 }
        ]
    };

    // Sample patient data (in a real app, this would come from a database)
    const patientDatabase = {
        'P001': {
            name: 'John Smith',
            age: 35,
            gender: 'male',
            phone: '(555) 123-4567',
            email: 'john.smith@example.com'
        },
        'P002': {
            name: 'Mary Johnson',
            age: 42,
            gender: 'female',
            phone: '(555) 234-5678',
            email: 'mary.johnson@example.com'
        },
        'P003': {
            name: 'Robert Lee',
            age: 28,
            gender: 'male',
            phone: '(555) 345-6789',
            email: 'robert.lee@example.com'
        },
        'P004': {
            name: 'Emma Davis',
            age: 8,
            gender: 'female',
            phone: '(555) 456-7890',
            email: 'parent.davis@example.com'
        }
    };

    // DOM Elements
    const patientIdInput = document.getElementById('patient-id');
    const searchPatientBtn = document.getElementById('search-patient');
    const patientNameInput = document.getElementById('patient-name');
    const patientAgeInput = document.getElementById('patient-age');
    const patientGenderSelect = document.getElementById('patient-gender');
    const patientPhoneInput = document.getElementById('patient-phone');
    const patientEmailInput = document.getElementById('patient-email');
    
    const treatmentCategorySelect = document.getElementById('treatment-category');
    const treatmentTypeSelect = document.getElementById('treatment-type');
    const treatmentPriceInput = document.getElementById('treatment-price');
    const treatmentDiscountInput = document.getElementById('treatment-discount');
    const addTreatmentBtn = document.getElementById('add-treatment');
    
    const billItemsBody = document.getElementById('bill-items-body');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    const generateBillBtn = document.getElementById('generate-bill');
    const clearBillBtn = document.getElementById('clear-bill');
    
    const billModal = document.getElementById('bill-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const printReceiptBtn = document.getElementById('print-receipt');
    const emailReceiptBtn = document.getElementById('email-receipt');
    const closeReceiptBtn = document.getElementById('close-receipt');
    
    // Variables for tracking bill items and totals
    let billItems = [];
    let subtotal = 0;
    let tax = 0;
    let total = 0;

    // Event Listeners
    searchPatientBtn.addEventListener('click', searchPatient);
    treatmentCategorySelect.addEventListener('change', updateTreatmentTypes);
    treatmentTypeSelect.addEventListener('change', updateTreatmentPrice);
    addTreatmentBtn.addEventListener('click', addTreatmentToBill);
    generateBillBtn.addEventListener('click', generateBill);
    clearBillBtn.addEventListener('click', clearBill);
    closeModalBtn.addEventListener('click', closeModal);
    printReceiptBtn.addEventListener('click', printReceipt);
    emailReceiptBtn.addEventListener('click', emailReceipt);
    closeReceiptBtn.addEventListener('click', closeModal);
    
    // Add event listeners for recent bills view buttons
    const viewBillButtons = document.querySelectorAll('.recent-bills .action-btn');
    viewBillButtons.forEach(button => {
        button.addEventListener('click', viewRecentBill);
    });

    // Function to search for a patient
    function searchPatient() {
        const patientId = patientIdInput.value.trim();
        
        if (patientId === '') {
            alert('Please enter a patient ID');
            return;
        }
        
        const patient = patientDatabase[patientId];
        
        if (patient) {
            // Populate patient fields
            patientNameInput.value = patient.name;
            patientAgeInput.value = patient.age;
            patientGenderSelect.value = patient.gender;
            patientPhoneInput.value = patient.phone;
            patientEmailInput.value = patient.email;
        } else {
            alert('Patient not found. Please enter a valid patient ID');
            // Clear patient fields
            patientNameInput.value = '';
            patientAgeInput.value = '';
            patientGenderSelect.value = '';
            patientPhoneInput.value = '';
            patientEmailInput.value = '';
        }
    }

    // Function to update treatment types based on selected category
    function updateTreatmentTypes() {
        const category = treatmentCategorySelect.value;
        
        // Clear current options
        treatmentTypeSelect.innerHTML = '<option value="" selected disabled>Select treatment</option>';
        
        // Reset price
        treatmentPriceInput.value = '';
        
        if (category) {
            // Enable treatment selection
            treatmentTypeSelect.disabled = false;
            
            // Populate treatment options
            const treatments = treatmentData[category];
            treatments.forEach(treatment => {
                const option = document.createElement('option');
                option.value = treatment.name;
                option.textContent = treatment.name;
                option.dataset.price = treatment.price;
                treatmentTypeSelect.appendChild(option);
            });
        } else {
            treatmentTypeSelect.disabled = true;
        }
    }

    // Function to update treatment price based on selected treatment
    function updateTreatmentPrice() {
        const selectedOption = treatmentTypeSelect.options[treatmentTypeSelect.selectedIndex];
        
        if (selectedOption && selectedOption.dataset.price) {
            treatmentPriceInput.value = selectedOption.dataset.price;
            treatmentPriceInput.disabled = true;
        } else {
            treatmentPriceInput.value = '';
        }
    }

    // Function to add treatment to bill
    function addTreatmentToBill() {
        const treatmentType = treatmentTypeSelect.value;
        const price = parseFloat(treatmentPriceInput.value);
        const discount = parseFloat(treatmentDiscountInput.value) || 0;
        
        if (!treatmentType || isNaN(price)) {
            alert('Please select a treatment');
            return;
        }
        
        // Calculate final price after discount
        const finalPrice = price - (price * discount / 100);
        
        // Create new bill item
        const billItem = {
            treatment: treatmentType,
            price: price,
            discount: discount,
            finalPrice: finalPrice
        };
        
        // Add to bill items array
        billItems.push(billItem);
        
        // Add row to bill table
        addBillTableRow(billItem);
        
        // Update totals
        updateTotals();
        
        // Reset treatment selection
        treatmentTypeSelect.selectedIndex = 0;
        treatmentPriceInput.value = '';
        treatmentDiscountInput.value = '0';
    }

    // Function to add a row to the bill table
    function addBillTableRow(billItem) {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${billItem.treatment}</td>
            <td>$${billItem.price.toFixed(2)}</td>
            <td>${billItem.discount}%</td>
            <td>$${billItem.finalPrice.toFixed(2)}</td>
            <td><button class="action-btn remove-item">Remove</button></td>
        `;
        
        // Add event listener to remove button
        const removeButton = row.querySelector('.remove-item');
        removeButton.addEventListener('click', function() {
            // Find index of this item
            const index = Array.from(billItemsBody.children).indexOf(row);
            
            // Remove from array
            billItems.splice(index, 1);
            
            // Remove from table
            row.remove();
            
            // Update totals
            updateTotals();
        });
        
        billItemsBody.appendChild(row);
    }

    // Function to update bill totals
    function updateTotals() {
        // Calculate subtotal
        subtotal = billItems.reduce((sum, item) => sum + item.finalPrice, 0);
        
        // Calculate tax (10%)
        tax = subtotal * 0.1;
        
        // Calculate total
        total = subtotal + tax;
        
        // Update DOM
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Function to generate bill
    function generateBill() {
        if (billItems.length === 0) {
            alert('Please add at least one treatment to the bill');
            return;
        }
        
        if (!patientNameInput.value) {
            alert('Please search for a patient or enter patient details');
            return;
        }
        
        // Get selected payment method
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        // Get notes
        const notes = document.getElementById('bill-notes').value;
        
        // Generate receipt ID
        const receiptId = `B-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
        
        // Get current date
        const currentDate = new Date().toLocaleDateString();
        
        // Fill receipt modal
        document.getElementById('receipt-id').textContent = receiptId;
        document.getElementById('receipt-date').textContent = currentDate;
        document.getElementById('receipt-patient-name').textContent = patientNameInput.value;
        document.getElementById('receipt-patient-id').textContent = patientIdInput.value || 'N/A';
        document.getElementById('receipt-patient-phone').textContent = patientPhoneInput.value || 'N/A';
        
        // Fill receipt items
        const receiptItemsBody = document.getElementById('receipt-items-body');
        receiptItemsBody.innerHTML = '';
        
        billItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.treatment}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.discount}%</td>
                <td>$${item.finalPrice.toFixed(2)}</td>
            `;
            receiptItemsBody.appendChild(row);
        });
        
        // Fill receipt totals
        document.getElementById('receipt-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('receipt-tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('receipt-total').textContent = `$${total.toFixed(2)}`;
        
        // Fill payment method and notes
        document.getElementById('receipt-payment-method').textContent = paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1);
        document.getElementById('receipt-notes').textContent = notes || 'None';
        
        // Show modal
        billModal.style.display = 'block';
    }

    // Function to clear bill
    function clearBill() {
        // Clear bill items array
        billItems = [];
        
        // Clear bill table
        billItemsBody.innerHTML = '';
        
        // Reset totals
        subtotal = 0;
        tax = 0;
        total = 0;
        
        // Update DOM
        subtotalElement.textContent = '$0.00';
        taxElement.textContent = '$0.00';
        totalElement.textContent = '$0.00';
        
        // Clear patient fields
        patientIdInput.value = '';
        patientNameInput.value = '';
        patientAgeInput.value = '';
        patientGenderSelect.value = '';
        patientPhoneInput.value = '';
        patientEmailInput.value = '';
        
        // Clear treatment selection
        treatmentCategorySelect.selectedIndex = 0;
        treatmentTypeSelect.innerHTML = '<option value="" selected disabled>Select treatment</option>';
        treatmentTypeSelect.disabled = true;
        treatmentPriceInput.value = '';
        treatmentDiscountInput.value = '0';
        
        // Clear notes
        document.getElementById('bill-notes').value = '';
    }

    // Function to close modal
    function closeModal() {
        billModal.style.display = 'none';
    }

    // Function to print receipt
    function printReceipt() {
        const receiptContent = document.querySelector('.modal-body').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Dental Bill Receipt</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                        th, td { padding: 8px; border-bottom: 1px solid #ddd; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .receipt-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                        .receipt-meta { text-align: right; }
                        h2, h3 { margin-top: 20px; }
                        .total-row { font-weight: bold; }
                        .receipt-footer { margin-top: 30px; text-align: center; font-size: 14px; color: #666; }
                    </style>
                </head>
                <body>
                    ${receiptContent}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    // Function to email receipt
    function emailReceipt() {
        const patientEmail = patientEmailInput.value;
        
        if (!patientEmail) {
            alert('Patient email is missing. Please enter an email address.');
            return;
        }
        
        // In a real app, this would send the email via a server
        alert(`Email receipt would be sent to ${patientEmail}`);
    }

    // Function to view a recent bill
    function viewRecentBill(event) {
        // In a real app, this would fetch the bill data from the server
        // For this demo, we'll show a sample receipt with mock data
        
        // Get the row data
        const row = event.target.closest('tr');
        const billId = row.cells[0].textContent;
        const patientName = row.cells[1].textContent;
        const date = row.cells[2].textContent;
        const amount = row.cells[3].textContent;
        const status = row.cells[4].querySelector('.status').textContent;
        
        // Fill receipt modal with sample data
        document.getElementById('receipt-id').textContent = billId;
        document.getElementById('receipt-date').textContent = date;
        document.getElementById('receipt-patient-name').textContent = patientName;
        document.getElementById('receipt-patient-id').textContent = 'P00' + (Math.floor(Math.random() * 5) + 1);
        document.getElementById('receipt-patient-phone').textContent = '(555) ' + Math.floor(100 + Math.random() * 900) + '-' + 
                                                                     Math.floor(1000 + Math.random() * 9000);
        
        // Create sample receipt items
        const receiptItemsBody = document.getElementById('receipt-items-body');
        receiptItemsBody.innerHTML = '';
        
        // Extract the numeric value from the amount string
        const totalAmount = parseFloat(amount.replace('$', '').replace(',', ''));
        
        // Generate random treatments that add up to the total
        let remainingAmount = totalAmount * 0.9; // Subtract tax
        const sampleTreatments = [];
        
        // Get random treatments from the treatment data
        const allCategories = Object.keys(treatmentData);
        while (remainingAmount > 0) {
            const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
            const treatments = treatmentData[randomCategory];
            const randomTreatment = treatments[Math.floor(Math.random() * treatments.length)];
            
            if (randomTreatment.price <= remainingAmount) {
                sampleTreatments.push({
                    treatment: randomTreatment.name,
                    price: randomTreatment.price,
                    discount: 0,
                    finalPrice: randomTreatment.price
                });
                remainingAmount -= randomTreatment.price;
            } else if (sampleTreatments.length === 0) {
                // Ensure at least one treatment is added
                const discount = Math.floor((1 - remainingAmount / randomTreatment.price) * 100);
                sampleTreatments.push({
                    treatment: randomTreatment.name,
                    price: randomTreatment.price,
                    discount: discount,
                    finalPrice: remainingAmount
                });
                remainingAmount = 0;
            }
            
            // Break if we've got enough treatments or can't add more
            if (sampleTreatments.length >= 3 || remainingAmount < 20) {
                break;
            }
        }
        
        // Add any remaining amount to the last treatment if necessary
        if (remainingAmount > 0 && sampleTreatments.length > 0) {
            sampleTreatments[sampleTreatments.length - 1].finalPrice += remainingAmount;
        }
        
        // Add sample treatments to receipt
        sampleTreatments.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.treatment}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.discount}%</td>
                <td>$${item.finalPrice.toFixed(2)}</td>
            `;
            receiptItemsBody.appendChild(row);
        });
        
        // Fill receipt totals
        const subtotal = totalAmount / 1.1; // Remove tax
        document.getElementById('receipt-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('receipt-tax').textContent = `$${(totalAmount - subtotal).toFixed(2)}`;
        document.getElementById('receipt-total').textContent = amount;
        
        // Fill payment method and notes
        const paymentMethods = ['Cash', 'Card', 'Insurance'];
        document.getElementById('receipt-payment-method').textContent = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        document.getElementById('receipt-notes').textContent = status === 'Paid' ? 'Payment completed.' : 'Payment pending.';
        
        // Show modal
        billModal.style.display = 'block';
    }

    // Close the modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === billModal) {
            closeModal();
        }
    });

    // Initialize the treatment type select
    treatmentTypeSelect.disabled = true;
});
