"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Thermometer, Droplets, CloudSun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function ControladorArmazenamentoCafeComponent() {
  const [ligado, setLigado] = useState(false);
  const [tempAlvo, setTempAlvo] = useState(20);
  const [tempAtual, setTempAtual] = useState(20);
  const [umidade, setUmidade] = useState(50);
  const [tempExterna, setTempExterna] = useState(25);
  const [historicoTemp, setHistoricoTemp] = useState([
    { hora: "00:00", temperatura: 20 },
    { hora: "04:00", temperatura: 21 },
    { hora: "08:00", temperatura: 22 },
    { hora: "12:00", temperatura: 23 },
    { hora: "16:00", temperatura: 22 },
    { hora: "20:00", temperatura: 21 },
  ]);

  useEffect(() => {
    if (!ligado) return;

    // Simula mudanças de temperatura
    const intervalo = setInterval(() => {
      setTempAtual((prev) => {
        const diff = tempAlvo - prev;
        const mudanca = Math.sign(diff) * Math.min(Math.abs(diff), 0.1);
        return Number((prev + mudanca).toFixed(1));
      });

      // Atualiza o histórico de temperatura
      setHistoricoTemp((prev) => {
        const agora = new Date();
        const hora = `${agora.getHours().toString().padStart(2, "0")}:${agora
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        return [...prev.slice(-5), { hora, temperatura: tempAtual }];
      });

      // Simula mudanças de umidade
      setUmidade((prev) =>
        Math.max(30, Math.min(70, prev + (Math.random() - 0.5) * 2))
      );

      // Simula mudanças de temperatura externa
      setTempExterna((prev) =>
        Math.max(15, Math.min(35, prev + (Math.random() - 0.5)))
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, [tempAlvo, tempAtual, ligado]);

  const togglePower = () => {
    setLigado((prev) => !prev);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Controlador de Armazenamento de Grãos de Café
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Status do Sistema</span>
            <div className="flex items-center space-x-2">
              <Switch checked={ligado} onCheckedChange={togglePower} />
              <span className={ligado ? "text-green-500" : "text-red-500"}>
                {ligado ? "Ligado" : "Desligado"}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controle de Temperatura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-semibold">Alvo: {tempAlvo}°C</span>
            <span className="text-2xl font-semibold">Atual: {tempAtual}°C</span>
          </div>
          <Slider
            value={[tempAlvo]}
            onValueChange={(value) => setTempAlvo(value[0])}
            max={30}
            min={10}
            step={0.1}
            disabled={!ligado}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Temperatura de Armazenamento
            </CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tempAtual}°C</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Umidade</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{umidade.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Temperatura Externa
            </CardTitle>
            <CloudSun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tempExterna.toFixed(1)}°C</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendência de Temperatura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicoTemp}>
                <XAxis dataKey="hora" />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background p-2 border rounded shadow">
                          <p className="text-foreground">
                            Hora: {payload[0].payload.hora}
                          </p>
                          <p className="text-foreground">
                            Temperatura: {payload[0].value}°C
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temperatura"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
