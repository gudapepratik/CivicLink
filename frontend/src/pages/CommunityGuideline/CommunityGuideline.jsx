import React from "react";

function CommunityGuideline() {

  const communityGuidelines = [
    {
        title: "Respect Others",
        message:
        "Treat everyone with respect, including fellow citizens and local authorities. Avoid using offensive, abusive, or discriminatory language in your posts, comments, or messages.",
    },
    {
      title: "Post Accurate Information",
      message:
        "Share only accurate and truthful information when reporting issues. Do not post false or misleading reports, as they may affect the efficiency of issue resolution.",
    },
    {
      title: "Protect Privacy",
      message:
        "Do not share personal information (such as phone numbers, addresses, or emails) in public posts. Respect the privacy of others while using the platform.",
    },
    {
      title: "Use the Platform Responsibly",
      message:
        "Report genuine community problems like water shortages, power outages, road damage, waste management issues, and more. Avoid spamming, posting irrelevant content, or misusing the platform for non-community-related matters.",
    },
    {
      title: "Be Kind and Constructive",
      message:
        "Maintain a positive tone, even when discussing sensitive or frustrating issues. Provide constructive feedback and avoid unnecessary criticism.",
    },
    {
      title: "No Harassment or Bullying",
      message:
        "Harassment, bullying, or targeting individuals will not be tolerated. Users engaging in such behavior may face suspension or permanent removal from the platform.",
    },
    {
      title: "Follow Legal Guidelines",
      message:
        "Ensure that your content complies with local laws and regulations. Any illegal activity reported through the platform will be handled according to the law.",
    },
    {
      title: "Respect Intellectual Property",
      message:
        "Do not post content that infringes on others' copyrights or intellectual property. Use original content or properly credit sources when necessary.",
    },
    {
      title: "Reporting Violations",
      message:
        "If you come across any content or behavior that violates these guidelines, please report it immediately through our platform’s reporting feature or contact us at support@communityconnect.com.",
    },
    {
      title: "Consequences of Violations",
      message:
        "Violations may result in warnings, content removal, account suspension, or permanent ban depending on the severity of the offense.",
    },
  ];

  return (
    <>
      <div className="w-full flex flex-col gap-5 p-2 font-outfit bg-white dark:bg-zinc-950">
        {/* Guidelines section  */}
        <div className="w-full flex flex-col gap-5 ">
          <h1 className="font-bold text-xl text-center">
            Community Gudidelines
          </h1>
          <p className="text-justify">
            Welcome to CivicLink! Our platform is designed to foster
            collaboration between local citizens and authorities for a better
            community. To maintain a safe, respectful, and productive
            environment, we ask all users to follow these community guidelines.
          </p>

          <div className="w-full border-b-[1px] border-zinc-200"></div>

          <div className="w-full flex flex-col gap-4">
            {communityGuidelines.map((data, key) => (
                <div key={key} className="w-full flex flex-col gap-1">
                    <h2 className="text-lg">{key+1}. {" "} {data.title}</h2>
                    <p className="text-sm">{data.message}</p>
                    <div className="w-full border-b-[1px] border-zinc-200"></div>
                </div>
            ))}
          </div>
        </div>

        {/* Technical support section  */}
        <div className="w-full flex flex-col gap-5 ">
          <h1 className="font-bold text-xl text-center">Reporting Violations</h1>
          <p className="text-left bg-zinc-200 dark:bg-zinc-800 rounded-lg p-2">If you come across any content or behavior that violates these guidelines, please report it immediately through our platform’s reporting feature or contact us at support@civiclink.com.</p>
        </div>

        <div className="w-full border-b-[1px] border-zinc-200"></div>
        {/* Message section  */}
        <h3 style={{fontStyle: "italic"}} className="text-">
            Together, let’s build a connected, respectful, and thriving community!
            Thank you for being a part of CivicLink.
        </h3>

        
      </div>
    </>
  );
}

export default CommunityGuideline;
