
export const reportTypes = [
  {
    id: 'whatsapp_double_tick',
    title: 'WhatsApp Double Tick Report',
    description: 'Upload WhatsApp message delivery reports',
    fields: [
      { label: 'Date Range', placeholder: 'e.g., 01/01/2024 - 31/01/2024' },
      { label: 'Campaign Name', placeholder: 'e.g., Monthly Health Tips' },
      { label: 'Target Audience', placeholder: 'e.g., Diabetes patients' }
    ]
  },
  {
    id: 'centro_call_center',
    title: 'Centro Call Center Report',
    description: 'Upload call center software reports',
    fields: [
      { label: 'Call Period', placeholder: 'e.g., Last 30 days' },
      { label: 'Department', placeholder: 'e.g., Patient Support' },
      { label: 'Call Type', placeholder: 'e.g., Appointment bookings' }
    ]
  },
  {
    id: 'raftaar_ambulance',
    title: 'Raftaar Ambulance Bookings',
    description: 'Upload ambulance booking reports',
    fields: [
      { label: 'Service Area', placeholder: 'e.g., Mumbai Central' },
      { label: 'Time Period', placeholder: 'e.g., Weekly report' },
      { label: 'Emergency Type', placeholder: 'e.g., Critical care' }
    ]
  },
  {
    id: 'just_dial_leads',
    title: 'Just Dial Leads Report',
    description: 'Upload Just Dial leads and enquiry reports',
    fields: [
      { label: 'Service Category', placeholder: 'e.g., Orthopaedic, Dental' },
      { label: 'Location Filter', placeholder: 'e.g., Mumbai, Nagpur' },
      { label: 'Date Range', placeholder: 'e.g., 01/06/2024 - 04/06/2024' }
    ]
  }
];
