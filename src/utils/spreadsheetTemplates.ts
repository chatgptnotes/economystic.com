// Sample data templates for each report type
const whatsappSampleData = [
  {
    patient_name: "John Doe",
    phone_number: "+1234567890",
    message_content: "Your appointment is confirmed for tomorrow at 10 AM",
    message_type: "text",
    sent_time: "2024-01-15T10:30:00Z",
    delivery_status: "delivered",
    read_status: "read",
    response: "Thank you for confirming"
  },
  {
    patient_name: "Jane Smith",
    phone_number: "+1234567891",
    message_content: "Please take your medication as prescribed",
    message_type: "text",
    sent_time: "2024-01-15T11:00:00Z",
    delivery_status: "sent",
    read_status: "unread",
    response: ""
  }
];

const callCenterSampleData = [
  {
    patient_name: "Alice Johnson",
    phone_number: "+1234567892",
    call_type: "appointment_booking",
    call_duration: 180,
    call_status: "completed",
    call_time: "2024-01-15T09:15:00Z",
    call_direction: "inbound",
    notes: "Booked appointment for next Tuesday"
  },
  {
    patient_name: "Bob Wilson",
    phone_number: "+1234567893",
    call_type: "follow_up",
    call_duration: 120,
    call_status: "missed",
    call_time: "2024-01-15T14:30:00Z",
    call_direction: "outbound",
    notes: "Patient feeling better after treatment"
  }
];

const ambulanceSampleData = [
  {
    patient_name: "Emergency Patient 1",
    phone_number: "+1234567894",
    pickup_location: "123 Main Street, Mumbai",
    destination: "City Hospital Emergency",
    booking_time: "2024-01-15T08:45:00Z",
    ambulance_type: "emergency",
    status: "completed",
    driver_name: "Raj Kumar"
  },
  {
    patient_name: "Emergency Patient 2",
    phone_number: "+1234567895",
    pickup_location: "456 Park Avenue, Mumbai",
    destination: "Metro Hospital",
    booking_time: "2024-01-15T12:20:00Z",
    ambulance_type: "standard",
    status: "completed",
    driver_name: "Suresh Sharma"
  }
];

const judicialLeadsSampleData = [
  {
    lead_name: "John Legal Case",
    phone_number: "+1234567896",
    email: "john.legal@example.com",
    case_type: "Civil",
    court_jurisdiction: "Mumbai High Court",
    case_number: "CIV/2024/001",
    case_description: "Property dispute regarding inheritance",
    lead_source: "Court records",
    date_generated: "2024-01-15T09:00:00Z",
    priority: "High",
    status: "New"
  },
  {
    lead_name: "Jane Criminal Matter",
    phone_number: "+1234567897",
    email: "jane.criminal@example.com",
    case_type: "Criminal",
    court_jurisdiction: "Delhi District Court",
    case_number: "CRIM/2024/002",
    case_description: "White collar crime investigation",
    lead_source: "Public records",
    date_generated: "2024-01-15T10:30:00Z",
    priority: "Medium",
    status: "Under Review"
  }
];

// Convert data to CSV format
const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Wrap in quotes if contains comma or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
};

// Download CSV file
const downloadCSV = (filename: string, csvContent: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const downloadSpreadsheetTemplate = (reportType: string) => {
  let sampleData: any[] = [];
  let filename = '';

  switch (reportType) {
    case 'whatsapp_double_tick':
      sampleData = whatsappSampleData;
      filename = 'whatsapp_messages_template.csv';
      break;
    case 'centro_call_center':
      sampleData = callCenterSampleData;
      filename = 'call_center_template.csv';
      break;
    case 'raftaar_ambulance':
      sampleData = ambulanceSampleData;
      filename = 'ambulance_bookings_template.csv';
      break;
    case 'judicial_leads':
      sampleData = judicialLeadsSampleData;
      filename = 'judicial_leads_template.csv';
      break;
    default:
      console.error('Unknown report type:', reportType);
      return;
  }

  const csvContent = convertToCSV(sampleData);
  downloadCSV(filename, csvContent);
};
