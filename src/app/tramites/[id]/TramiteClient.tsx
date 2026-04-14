"use client";

import { useState } from "react";
import { CheckCircle2, Circle, MapPin, Clock, Phone, AlertCircle, FileText, ChevronDown, ChevronUp, ShieldCheck, ExternalLink } from "lucide-react";

type TramiteProps = {
  tramite: any; // Using any to simplify MVP, in prod use exact Prisma relation type
  userAge?: string | null;
}

export default function TramiteClient({ tramite, userAge }: TramiteProps) {
  const [activeTab, setActiveTab] = useState('pasos');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [checkedReqs, setCheckedReqs] = useState<Record<string, boolean>>({});
  const [expandedVenue, setExpandedVenue] = useState<string | null>(null);

  const toggleReq = (id: string) => setCheckedReqs(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleVenue = (id: string) => setExpandedVenue(prev => prev === id ? null : id);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* HEADER CON ENLACE EXTERNO SI EXISTE */}
      {tramite.externalLink && (
        <div className="bg-brand-secondary/10 p-4 border-b border-brand-secondary/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-brand-secondary-dark font-bold text-sm uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5" />
            Acceso Directo Oficial
          </div>
          <a 
            href={tramite.externalLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-brand-secondary text-brand-primary-dark font-bold px-6 py-2 rounded-xl hover:bg-brand-secondary-dark transition-all shadow-sm hover:shadow-md flex items-center gap-2 text-sm"
          >
            Consultar Estado de Documento en Registraduría
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* TABS HEADER */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {['pasos', 'requisitos', 'puntos', 'tips'].map((tab) => {
          // HU-11: Ocultar si no hay recomendaciones y es tab 'tips'
          if (tab === 'tips' && tramite.recomendaciones.length === 0) return null;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-6 text-sm font-bold min-h-[44px] min-w-[120px] transition capitalize
                ${activeTab === tab ? 'text-brand-primary bg-brand-primary/10 border-b-2 border-brand-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
              `}
            >
              {tab === 'pasos' && "Procedimiento"}
              {tab === 'requisitos' && "Requisitos y Documentos"}
              {tab === 'puntos' && "Puntos de Atención"}
              {tab === 'tips' && "Recomendaciones"}
            </button>
          )
        })}
      </div>

      <div className="p-8">
        {/* HU-08: Procedimiento / Steps */}
        {activeTab === 'pasos' && (
          <div>
            {tramite.pasos.length === 0 ? (
              <div className="bg-brand-primary/5 text-brand-primary-dark p-6 rounded-xl border border-brand-primary/10 text-center font-medium">
                El procedimiento detallado para este trámite se encuentra en construcción o no está disponible actualmente.
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-8">
                {/* Visual Step Indicator (Timeline) */}
                <div className="md:w-1/3 flex flex-col gap-4 border-l-2 border-gray-200 ml-3 pl-6">
                  {tramite.pasos.map((paso: any, idx: number) => (
                    <button
                   key={paso.id}
                   onClick={() => setCurrentStepIndex(idx)}
                   className={`relative text-left font-bold transition min-h-[44px] ${idx === currentStepIndex ? 'text-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   <span className={`absolute -left-[35px] top-1 w-4 h-4 rounded-full border-2 bg-white ${idx === currentStepIndex ? 'border-brand-primary' : 'border-slate-300'}`}></span>
                   {`Paso ${idx + 1}`}
                 </button>
                  ))}
                </div>
                {/* Active Step Content */}
                <div className="md:w-2/3 bg-gray-50 rounded-2xl p-8 border border-gray-100 relative min-h-[250px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tramite.pasos[currentStepIndex].title}</h3>
                    <p className="text-gray-600 leading-relaxed">{tramite.pasos[currentStepIndex].description}</p>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button 
                      onClick={() => setCurrentStepIndex(i => Math.max(0, i - 1))}
                      disabled={currentStepIndex === 0}
                      className="px-6 py-2 bg-white border border-gray-300 rounded font-semibold text-gray-700 disabled:opacity-50 min-h-[44px] min-w-[44px]"
                    >Anterior</button>
                    <button 
                      onClick={() => setCurrentStepIndex(i => Math.min(tramite.pasos.length - 1, i + 1))}
                      disabled={currentStepIndex === tramite.pasos.length - 1}
                      className="px-8 py-2 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary-dark disabled:opacity-50 min-h-[44px] min-w-[44px] shadow-md transition-all active:scale-95"
                    >Siguiente</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HU-09: Requisitos / Checklist */}
        {activeTab === 'requisitos' && (
          <div>
            {tramite.requisitos.length === 0 ? (
               <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 text-center font-medium flex items-center justify-center gap-2">
                 <CheckCircle2 /> Este trámite no requiere presentar documentación previa.
               </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">Marca los documentos que ya tienes listos:</p>
                {tramite.requisitos.map((req: any) => (
                  <button
                    key={req.id}
                    onClick={() => toggleReq(req.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition text-left min-h-[60px]
                      ${checkedReqs[req.id] ? 'bg-green-50 border-green-500 text-green-900' : 'bg-white border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    <div className="flex gap-4 items-center">
                      <FileText className={checkedReqs[req.id] ? 'text-green-600' : 'text-gray-400'} />
                      <span className="font-semibold text-lg">{req.title}</span>
                    </div>
                    {checkedReqs[req.id] ? <CheckCircle2 className="w-8 h-8 text-green-600" /> : <Circle className="w-8 h-8 text-gray-300" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HU-10: Puntos de Atención */}
        {activeTab === 'puntos' && (
          <div>
            {tramite.isOnline ? (
              <div className="bg-brand-primary/5 text-brand-primary-dark p-8 rounded-xl border border-brand-primary/10 text-center flex flex-col items-center justify-center">
                 <div className="w-16 h-16 bg-brand-secondary/20 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle2 className="w-8 h-8 text-brand-secondary-dark" />
                 </div>
                 <h2 className="text-xl font-bold mb-2">Este trámite es 100% en línea.</h2>
                 <p>No requiere asistencia presencial en ninguna sede.</p>
              </div>
            ) : (
               <div className="space-y-4">
                {tramite.puntosAtencion.filter((p: any) => !p.status || p.status === "activo").map((punto: any) => (
                  <div key={punto.id} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <button 
                      onClick={() => toggleVenue(punto.id)}
                      className="w-full flex items-center justify-between p-6 bg-white min-h-[44px]"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="text-gray-400" />
                        <span className="font-bold text-gray-900">{punto.address}</span>
                      </div>
                      {expandedVenue === punto.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                    </button>
                    {expandedVenue === punto.id && (
                      <div className="p-6 border-t border-gray-200 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-slate-700">
                           <Clock className="w-5 h-5 text-brand-secondary" />
                           <span className="font-medium">Horario: {punto.schedule}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                           <Phone className="w-5 h-5 text-brand-secondary" />
                           <span className="font-medium">Teléfono: {punto.phone}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HU-11: Recomendaciones y Tips */}
        {activeTab === 'tips' && (
          <div>
            {tramite.recomendaciones.length === 0 ? (
              <div className="bg-gray-50 text-gray-700 p-6 rounded-xl border border-gray-200 text-center font-medium">
                No hay recomendaciones adicionales registradas.
              </div>
            ) : (
              <ul className="space-y-4 list-none pl-0">
                {tramite.recomendaciones.map((rec: any, idx: number) => {
                  const isTargeted = rec.targetAgeRange && rec.targetAgeRange === userAge;
                  return (
                    <li key={rec.id} className={`p-6 rounded-xl flex gap-4 
                       ${isTargeted ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-gray-50 border border-gray-200'}`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <AlertCircle className={isTargeted ? 'text-yellow-600' : 'text-gray-400'} />
                      </div>
                      <div>
                        {isTargeted && <span className="block text-yellow-800 font-bold text-sm mb-1 uppercase tracking-wide">Tip personalizado: Atención preferencial disponible para su edad</span>}
                        <p className={isTargeted ? 'text-yellow-900 font-medium' : 'text-gray-700 font-medium'}>{rec.text}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
