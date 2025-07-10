import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search,
  Plus,
  Users,
  Clock,
  TrendingUp,
  Bell,
  Calendar,
  Brain,
  UserPlus,
  Activity,
  AlertTriangle
} from "lucide-react";

const Dashboard = () => {
  // Patient examination data
  const examinationStats = {
    total: 7,
    lowRisk: 6,
    mediumRisk: 1,
    highRisk: 0
  };

  // Patient reminders data
  const patientReminders = [
    { name: "Shakti Singh", date: "27-07-2023", time: "21:01", avatar: "/lovable-uploads/b851c275-b12a-4121-9e3f-1f76d80b4d1f.png" },
    { name: "Cameron", date: "30-11-2023", time: "19:17", avatar: null },
    { name: "Maria Rodriguez", date: "15-12-2023", time: "14:30", avatar: null },
    { name: "James Wilson", date: "18-12-2023", time: "09:45", avatar: null }
  ];

  // Latest news data
  const latestNews = [
    {
      title: "New Study Links Sleep Patterns to Type 2 Diabetes Risk",
      description: "Research shows poor sleep quality increases diabetes risk by 23% in adults over 40.",
      image: "/lovable-uploads/b851c275-b12a-4121-9e3f-1f76d80b4d1f.png",
      date: "2 hours ago"
    },
    {
      title: "FDA Approves New Continuous Glucose Monitor",
      description: "Latest CGM technology provides real-time glucose monitoring with improved accuracy.",
      image: "/lovable-uploads/b851c275-b12a-4121-9e3f-1f76d80b4d1f.png",
      date: "5 hours ago"
    },
    {
      title: "Lifestyle Intervention Program Shows 40% Risk Reduction",
      description: "Comprehensive lifestyle changes demonstrate significant diabetes prevention outcomes.",
      image: "/lovable-uploads/b851c275-b12a-4121-9e3f-1f76d80b4d1f.png",
      date: "1 day ago"
    }
  ];

  // Peer findings data
  const peerFindings = [
    {
      title: "Early Intervention Protocol",
      description: "New pre-diabetes screening guidelines show 35% improvement in early detection",
      author: "Dr. Sarah Chen",
      hospital: "Mayo Clinic"
    },
    {
      title: "Medication Adherence Study",
      description: "Digital reminders increase metformin compliance by 42% in newly diagnosed patients",
      author: "Dr. Michael Roberts",
      hospital: "Johns Hopkins"
    }
  ];

  // Statistics & trends data
  const statisticsData = [
    "85% of pre-diabetic patients show improvement with lifestyle interventions within 6 months",
    "Patients with family history of diabetes have 2.5x higher risk scores in our prediction model",
    "Social determinants of health account for 30% of diabetes risk variance in urban populations",
    "Combined clinical and lifestyle data improves prediction accuracy by 18% over clinical data alone",
    "Early intervention reduces progression to Type 2 diabetes by 58% in high-risk patients"
  ];

  // High risk symptoms data
  const highRiskSymptoms = [
    { name: "Increased susceptibility to infection", percentage: 29, color: "#0891b2" },
    { name: "Joint redness", percentage: 22, color: "#0e7490" },
    { name: "Mumps symptoms and signs", percentage: 21, color: "#164e63" },
    { name: "Attention deficit (inattention)", percentage: 18, color: "#155e75" },
    { name: "Blurred vision", percentage: 7, color: "#0c4a6e" }
  ];

  // Today's visits data
  const todayVisits = [
    { time: "09:00", patient: "John Doe", type: "Follow-up", status: "completed" },
    { time: "10:30", patient: "Emily Chen", type: "Screening", status: "in-progress" },
    { time: "11:45", patient: "Robert Smith", type: "Consultation", status: "scheduled" },
    { time: "14:00", patient: "Lisa Johnson", type: "Results Review", status: "scheduled" },
    { time: "15:30", patient: "David Wilson", type: "Initial Assessment", status: "scheduled" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
                <Brain className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-semibold">Predict Disease</h1>
                <Badge variant="secondary" className="text-xs">Beta</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/lovable-uploads/b851c275-b12a-4121-9e3f-1f76d80b4d1f.png" />
                  <AvatarFallback>DJ</AvatarFallback>
                </Avatar>
                <span className="text-sm">Dr. John</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sub Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Physician Dashboard</h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Wed 9 July</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Patient Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-muted rounded-lg">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Patient Search</h3>
                <div className="flex items-center space-x-4">
                  <Select>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="emily-chen">Emily Chen</SelectItem>
                      <SelectItem value="robert-smith">Robert Smith</SelectItem>
                      <SelectItem value="pooja-shah">Pooja Shah</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => window.location.href = '/patient/22'}>Search</Button>
                  <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Patient
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Examination Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Patient's Examined</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">From:</span>
                <Input type="date" className="w-40" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">To:</span>
                <Input type="date" className="w-40" />
              </div>
              <Button className="bg-primary">Apply</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-muted-foreground">{examinationStats.total}</div>
                <div className="text-sm text-muted-foreground">Total Examined</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{examinationStats.lowRisk}</div>
                <div className="text-sm text-muted-foreground">Low Risk</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{examinationStats.mediumRisk}</div>
                <div className="text-sm text-muted-foreground">Medium Risk</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{examinationStats.highRisk}</div>
                <div className="text-sm text-muted-foreground">High Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          {/* Patient Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Patient Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientReminders.map((reminder, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      {reminder.avatar ? (
                        <AvatarImage src={reminder.avatar} />
                      ) : (
                        <AvatarFallback>{reminder.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{reminder.name}</div>
                      <div className="text-xs text-muted-foreground">{reminder.date} {reminder.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Latest News */}
          <Card>
            <CardHeader>
              <CardTitle>Latest News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestNews.map((news, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="w-12 h-12 bg-muted rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium leading-tight mb-1">{news.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{news.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">{news.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Peer Findings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Peer Findings</span>
                <Button size="sm" variant="ghost" className="text-primary">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {peerFindings.map((finding, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-sm font-medium">{finding.title}</div>
                    <div className="text-xs text-muted-foreground">{finding.description}</div>
                    <div className="text-xs text-primary">{finding.author}, {finding.hospital}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistics & Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Statistics & Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {statisticsData.map((stat, index) => (
                  <div key={index} className="text-xs text-muted-foreground leading-relaxed">
                    • {stat}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* High Risk Patient Group & Symptoms */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>High Risk Patient Group</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No High Risk Patients Currently</p>
                  <p className="text-sm mt-2">All patients are in low to medium risk categories</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>High Risk Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative w-48 h-48 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="80" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      {highRiskSymptoms.map((symptom, index) => {
                        const circumference = 2 * Math.PI * 80;
                        const offset = circumference - (symptom.percentage / 100) * circumference;
                        const rotation = index * 72; // 360/5 symptoms
                        return (
                          <circle
                            key={index}
                            cx="96"
                            cy="96"
                            r="80"
                            fill="none"
                            stroke={symptom.color}
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '96px 96px' }}
                          />
                        );
                      })}
                    </svg>
                  </div>
                  <div className="space-y-2">
                    {highRiskSymptoms.map((symptom, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: symptom.color }}
                          ></div>
                          <span className="text-xs">{symptom.name}</span>
                        </div>
                        <span className="font-medium">{symptom.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today Visits */}
          <Card>
            <CardHeader>
              <CardTitle>Today Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayVisits.map((visit, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-primary">{visit.time}</div>
                      <div>
                        <div className="text-sm font-medium">{visit.patient}</div>
                        <div className="text-xs text-muted-foreground">{visit.type}</div>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        visit.status === 'completed' ? 'default' : 
                        visit.status === 'in-progress' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                    </Badge>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule New Visit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;