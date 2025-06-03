import React from "react";

export default function Skills() {
  const skills = [
    {
      category: "Frontend",
      items: [
        { name: "React", level: 90 },
        { name: "Next.js", level: 85 },
        { name: "TypeScript", level: 80 },
        { name: "HTML/CSS", level: 95 },
        { name: "Tailwind CSS", level: 85 },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", level: 75 },
        { name: "Express", level: 70 },
        { name: "PostgreSQL", level: 65 },
        { name: "MongoDB", level: 60 },
      ],
    },
    {
      category: "Tools & Others",
      items: [
        { name: "Git", level: 85 },
        { name: "Docker", level: 70 },
        { name: "AWS", level: 65 },
        { name: "Figma", level: 80 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Skill Set
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((category) => (
            <div
              key={category.category}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.items.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">{skill.name}</span>
                      <span className="text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
