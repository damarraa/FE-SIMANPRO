import React from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  Briefcase, 
  GraduationCap, 
  Award,
  Edit,
  Download,
  Check,
  Clock,
  Users,
  Calendar,
  FileText
} from "lucide-react";

const DetailTenagaKerja = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
            <Users className="w-6 h-6" />
            Detail Tenaga Kerja
          </h1>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-[#0D47A1] bg-white border border-[#CFD8DC] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#2196F3] rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download CV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-[#CFD8DC] overflow-hidden">
            <div className="relative">
              {/* Cover Photo */}
              <div className="h-32 bg-gradient-to-r from-[#2196F3] to-[#0D47A1]"></div>
              
              {/* Profile Section */}
              <div className="px-6 pb-6 relative">
                <div className="flex justify-between">
                  <div className="flex items-end gap-4 -mt-12">
                    <div className="relative">
                      <img
                        src="https://i.pravatar.cc/150?img=10"
                        alt="profile"
                        className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
                      />
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#0D47A1]">Jack Sally</h2>
                      <p className="text-[#2196F3] font-medium">Project Manager</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-[#0D47A1]">
                    <Mail className="w-5 h-5 text-[#2196F3]" />
                    <span>historia@mail.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#0D47A1]">
                    <Phone className="w-5 h-5 text-[#2196F3]" />
                    <span>+12 3456 97890</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#0D47A1]">
                    <MapPin className="w-5 h-5 text-[#2196F3]" />
                    <span>Jakarta, Indonesia</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#CFD8DC] mx-6"></div>

            {/* About Section */}
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold text-[#0D47A1] mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#2196F3]" />
                Professional Summary
              </h3>
              <p className="text-[#0D47A1] leading-relaxed">
                Experienced Project Manager with 8+ years in leading cross-functional teams to deliver complex projects on time and within budget. 
                Specialized in agile methodologies and process optimization. Strong background in stakeholder management and risk mitigation.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-[#CFD8DC] mx-6"></div>

            {/* Education Section */}
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold text-[#0D47A1] mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#2196F3]" />
                Education
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-[#2196F3]" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0D47A1]">Master of History</h4>
                    <p className="text-sm text-[#0D47A1]">University PRISAN Historia</p>
                    <p className="text-xs text-[#90A4AE]">2017–2020</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-[#2196F3]" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0D47A1]">History Major</h4>
                    <p className="text-sm text-[#0D47A1]">University PRISAN Historia</p>
                    <p className="text-xs text-[#90A4AE]">2013–2017</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#CFD8DC] mx-6"></div>

            {/* Skills Section */}
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold text-[#0D47A1] mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#2196F3]" />
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Project Management', 'Agile Methodologies', 'Team Leadership', 
                  'Risk Management', 'Stakeholder Communication', 'Budget Control',
                  'Process Optimization', 'Strategic Planning'].map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-[#2196F3] rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Projects and Activity */}
        <div className="space-y-6">
          {/* Projects Card */}
          <div className="bg-white rounded-xl shadow-sm border border-[#CFD8DC] p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#0D47A1]">Recent Projects</h3>
              <button className="text-sm text-[#2196F3] hover:text-blue-600 flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { 
                  name: "Digital Transformation Initiative", 
                  date: "April 15, 2025", 
                  status: "In Progress", 
                  progress: 65,
                  color: "bg-blue-100 text-blue-800"
                },
                { 
                  name: "CRM System Implementation", 
                  date: "March 21, 2025", 
                  status: "Completed", 
                  progress: 100,
                  color: "bg-green-100 text-green-800"
                },
                { 
                  name: "Market Expansion Analysis", 
                  date: "March 6, 2025", 
                  status: "On Hold", 
                  progress: 30,
                  color: "bg-yellow-100 text-yellow-800"
                },
              ].map((project, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-[#0D47A1] group-hover:text-[#2196F3] transition-colors">{project.name}</h4>
                      <p className="text-sm text-[#90A4AE]">{project.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.color}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-[#CFD8DC] rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          project.progress === 100 ? 'bg-green-500' : 
                          project.progress > 50 ? 'bg-[#2196F3]' : 'bg-yellow-500'
                        }`} 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-[#90A4AE] mt-1 text-right">{project.progress}% complete</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-[#CFD8DC] p-6">
            <h3 className="text-lg font-semibold text-[#0D47A1] mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { 
                  action: "Completed project review", 
                  time: "2 hours ago", 
                  icon: <Check className="w-5 h-5 text-green-500" />,
                  color: "bg-green-100"
                },
                { 
                  action: "Submitted Q2 report", 
                  time: "Yesterday, 3:45 PM", 
                  icon: <FileText className="w-5 h-5 text-[#2196F3]" />,
                  color: "bg-blue-100"
                },
                { 
                  action: "Team meeting with stakeholders", 
                  time: "Apr 12, 10:30 AM", 
                  icon: <Users className="w-5 h-5 text-purple-500" />,
                  color: "bg-purple-100"
                },
                { 
                  action: "Updated project timeline", 
                  time: "Apr 10, 4:20 PM", 
                  icon: <Clock className="w-5 h-5 text-yellow-500" />,
                  color: "bg-yellow-100"
                },
              ].map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full ${activity.color} flex items-center justify-center`}>
                    {activity.icon}
                  </div>
                  <div>
                    <p className="font-medium text-[#0D47A1]">{activity.action}</p>
                    <p className="text-sm text-[#90A4AE]">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-[#CFD8DC] p-6">
            <h3 className="text-lg font-semibold text-[#0D47A1] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-blue-50 text-[#2196F3] rounded-lg hover:bg-blue-100 transition-colors flex flex-col items-center">
                <Mail className="w-5 h-5 mb-1" />
                <span className="text-sm">Send Email</span>
              </button>
              <button className="p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center">
                <Phone className="w-5 h-5 mb-1" />
                <span className="text-sm">Schedule Call</span>
              </button>
              <button className="p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex flex-col items-center">
                <Briefcase className="w-5 h-5 mb-1" />
                <span className="text-sm">Assign Project</span>
              </button>
              <button className="p-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors flex flex-col items-center">
                <Award className="w-5 h-5 mb-1" />
                <span className="text-sm">Give Feedback</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTenagaKerja;