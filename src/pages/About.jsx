import React from "react";
import { motion } from "framer-motion";
import { Users, Award, Building2, Globe2 } from "lucide-react";

export default function About() {
  return (
    <div className="pt-32 pb-20 bg-[#0A0F1C]">
      <div className="container mx-auto px-4">
        {/* Hero Section (No Animation) */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About DermAI</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Revolutionizing skin health through artificial intelligence and medical expertise
          </p>
        </div>

        {/* Mission & Vision */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          {[
            {
              title: "Our Mission",
              description:
                "To make professional-grade skin analysis accessible to everyone through advanced AI technology, empowering individuals to take control of their skin health with confidence and ease.",
            },
            {
              title: "Our Vision",
              description:
                "To become the global leader in AI-powered dermatology, creating a world where early detection and prevention of skin conditions is available to all, regardless of location or resources.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-4">{item.title}</h2>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {[
            { number: "98.5%", label: "Accuracy Rate" },
            { number: "1M+", label: "Analyses Performed" },
            { number: "150+", label: "Countries Served" },
            { number: "50+", label: "Medical Partners" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Team */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Leadership</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Siddhesh Zalte",
                role: "Chief Medical Officer",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
              },
              {
                name: "Michael Roberts",
                role: "Chief Technology Officer",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 text-center"
              >
                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Users className="w-8 h-8 text-blue-400" />, title: "Patient First", description: "Every decision we make prioritizes patient well-being and care quality." },
              { icon: <Award className="w-8 h-8 text-purple-400" />, title: "Excellence", description: "We maintain the highest standards in technology and medical accuracy." },
              { icon: <Building2 className="w-8 h-8 text-green-400" />, title: "Innovation", description: "Continuously pushing boundaries in AI and healthcare technology." },
              { icon: <Globe2 className="w-8 h-8 text-red-400" />, title: "Accessibility", description: "Making advanced skin care accessible to everyone, everywhere." },
            ].map((value, index) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
              >
                <div className="bg-white/5 rounded-3xl p-3 w-fit mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
