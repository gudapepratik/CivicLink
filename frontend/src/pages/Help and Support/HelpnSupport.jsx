import { CollapsibleBasic } from '@/components/Collapsible/Collapsible'
import React from 'react'


function HelpnSupport() {
  const faqData = {
    citizens: [
      {
        question: "How do I report an issue?",
        answer: "Go to the homepage and click on 'Report an Issue'. Fill in the required details, add images, set the location on the map, and submit."
      },
      {
        question: "What kind of issues can I report?",
        answer: "You can report issues related to water supply, electricity outages, roads, waste management, pollution control, traffic, and emergencies."
      },
      {
        question: "How can I track my reported issue?",
        answer: "Once submitted, go to your 'Dashboard' to see the status of your reported issues."
      },
      {
        question: "Can I edit or delete my report?",
        answer: "Yes, you can edit or delete any issue you've reported by visiting your 'My Reports' section."
      },
      {
        question: "How do I upvote or comment on an issue?",
        answer: "Click on the issue and use the upvote button or scroll down to leave a comment."
      }
    ],
    authorities: [
      {
        question: "How do I view the issues reported?",
        answer: "After logging in, head to your 'Dashboard' to see all the issues assigned to your department."
      },
      {
        question: "How do I mark an issue as resolved?",
        answer: "Click on any issue, add relevant notes, and select 'Mark as Resolved'."
      },
      {
        question: "Can I reject an issue?",
        answer: "Yes, select the issue and click 'Reject', providing a reason for the rejection."
      },
      {
        question: "How do I update my profile?",
        answer: "Go to the 'Profile' section to update your contact details and profile information."
      }
    ],
    technicalSupport: [
      {
        question: "What should I do if I encounter a technical issue on the platform?",
        answer: "If you face any technical difficulties, please contact our technical support team at support@civiclink.com or call +91-9876543210."
      },
      {
        question: "How do I reset my password?",
        answer: "Go to the login page, click on 'Forgot Password?', and follow the instructions to reset your password via email."
      },
      {
        question: "Why am I unable to upload images while reporting an issue?",
        answer: "Ensure that your images are in supported formats (JPG, PNG) and the total file size does not exceed 10 MB. If the issue persists, please contact support."
      },
      {
        question: "How do I update my profile information?",
        answer: "Navigate to the 'Profile' section in your dashboard and click on 'Edit Profile' to update your details."
      },
      {
        question: "The map is not loading properly. What should I do?",
        answer: "Check your internet connection and make sure that location services are enabled in your browser settings. If the problem continues, contact technical support."
      },
      {
        question: "Is my data secure on CivicLink?",
        answer: "Yes, we use industry-standard encryption and security measures to ensure that your data is safe and secure."
      }
    ]
  }
  
  return (
    <>
      <div className='w-full flex flex-col gap-5 p-2 font-outfit bg-white dark:bg-zinc-950'>

        {/* FAQ section  */}
        <div className='w-full flex flex-col gap-5 '>
            <h1 className='font-bold text-xl text-center'>FAQ's</h1>

            {/* Citizen questions  */}
            <div className='w-full flex flex-col gap-2'>
              <h2>For Citizens</h2>
              <div className='w-full flex flex-col gap-1'>
                  {faqData.citizens.map((data, key) => (
                    <CollapsibleBasic key={key} question={data.question} answer={data.answer}/>
                  ))}
              </div>
            </div>
            
            {/* authority questions  */}
            <div className='w-full flex flex-col gap-3'>
              <h2>For Authorities</h2>
              <div className='w-full flex flex-col gap-1'>
                  {faqData.authorities.map((data, key) => (
                    <CollapsibleBasic key={key} question={data.question} answer={data.answer}/>
                  ))}
              </div>
            </div>
        </div>

        <div className='w-full border-b-[1px] border-zinc-200'></div>

        {/* Technical support section  */}
        <div className='w-full flex flex-col gap-5 '>
            <h1 className='font-bold text-xl text-center'>Technical Support</h1>
              <div className='w-full flex flex-col gap-1'>
                  {faqData.technicalSupport.map((data, key) => (
                    <CollapsibleBasic key={key} question={data.question} answer={data.answer}/>
                  ))}
              </div>
        </div>

        <div className='w-full border-b-[1px] border-zinc-200'></div>

        {/* Contact us Section  */}
        <div className='w-full flex flex-col gap-5'>
            <h1 className='font-bold text-xl text-center'>Contact Us</h1>
              <div className='w-full flex flex-col gap-1 bg-zinc-500 dark:bg-zinc-800 p-3 rounded-xl text-white'>
                  <h3>If you need further assistance, feel free to reach out to our support team:</h3>
                  <h3>Email: support@cciviclink.com</h3>
                  <h3>Phone: +91-9876543210</h3>
                  <h3>Office: 123 Civic Center, Pune, Maharashtra – 411001</h3>
              </div>
        </div>
      </div>
    </>
  )
}

export default HelpnSupport