import React from "react";

export default function History() {
  const experiences = [
    {
      year: "2023",
      title: "Senior Frontend Engineer",
      company: "Tech Innovation Inc.",
      description: [
        "Led frontend development for a large-scale e-commerce site",
        "Reduced page load time by 50% through performance optimization",
        "Mentored and provided technical guidance to team members",
      ],
    },
    {
      year: "2021",
      title: "Frontend Engineer",
      company: "Web Creation Inc.",
      description: [
        "Developed web applications using React/Next.js",
        "Proposed and implemented UI/UX improvements",
        "Built and operated CI/CD pipelines",
      ],
    },
    {
      year: "2019",
      title: "Web Designer",
      company: "Digital Creator Inc.",
      description: [
        "Designed and implemented corporate websites",
        "Implemented responsive design",
        "Ensured accessibility compliance",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Career History
        </h1>
        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="relative pl-8 pb-12 border-l-2 border-blue-500 last:border-l-0"
            >
              <div className="absolute -left-3 mt-1">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-blue-500 mr-4">
                    {exp.year}
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {exp.title}
                    </h2>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                </div>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {exp.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
