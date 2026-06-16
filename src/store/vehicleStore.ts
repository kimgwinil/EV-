import { create } from 'zustand';

export interface EvCell {
    id: string;
    voltage: number;
    temp: number;
    soc: number;
    balancing: boolean;
}

export interface VehicleTelemetryDB {
    // System Status
    timestamp: number;
    powerMode: 'OFF' | 'ACC' | 'READY';
    msdConnected: boolean; // false = Safety LOTO state
    
    // Battery Database Parameters
    cells: EvCell[];
    sysVoltage: number;
    sysCurrent: number;
    packSoc: number;
    packTemp: number;
    isBalancing: boolean;
    bmsFault: 'none' | 'temp_warning' | 'cell_imbalance' | 'msd_disconnected';
    
    // Powertrain Parameters
    motorRpm: number;
    motorTemp: number;
    inverterTemp: number;
    obcActive: boolean;

    // Actions
    setPowerMode: (mode: 'OFF' | 'ACC' | 'READY') => void;
    setMsdConnected: (status: boolean) => void;
    setMotorRpm: (rpm: number) => void;
    setPackSoc: (soc: number) => void;
    setInverterTemp: (temp: number) => void;
    toggleBalancing: () => void;
    setFaultScenario: (fault: 'none' | 'temp_warning' | 'cell_degradation') => void;
    chargeStep: () => void;
    tickSimulation: () => void;
}

const generateInitialCells = (): EvCell[] => {
    return Array.from({length: 16}, (_, i) => ({
        id: `CELL_${String(i+1).padStart(2,'0')}`,
        voltage: 3.7 + (Math.random() * 0.05),
        temp: 25 + (Math.random() * 2),
        soc: 50 + (Math.random() * 2),
        balancing: false
    }));
};

export const useVehicleStore = create<VehicleTelemetryDB>((set, get) => ({
    timestamp: Date.now(),
    powerMode: 'OFF',
    msdConnected: true,
    
    cells: generateInitialCells(),
    sysVoltage: 16 * 3.7,
    sysCurrent: 0,
    packSoc: 50,
    packTemp: 25,
    isBalancing: false,
    bmsFault: 'none',
    
    motorRpm: 0,
    motorTemp: 22,
    inverterTemp: 24,
    obcActive: false,

    setPowerMode: (mode) => set({ powerMode: mode }),
    setMsdConnected: (status) => set(state => ({ 
        msdConnected: status, 
        powerMode: status ? state.powerMode : 'OFF',
        bmsFault: status ? 'none' : 'msd_disconnected' 
    })),
    setMotorRpm: (rpm) => set({ motorRpm: rpm }),
    setPackSoc: (soc) => set({ packSoc: soc }),
    setInverterTemp: (temp) => set({ inverterTemp: temp }),
    toggleBalancing: () => set(state => ({ isBalancing: !state.isBalancing })),
    
    setFaultScenario: (fault) => set(state => {
        const newCells = [...state.cells];
        if (fault === 'none') {
            return { bmsFault: 'none', cells: newCells.map(c => ({...c, temp: 25 + Math.random(), voltage: 3.8, soc: 60})) };
        } else if (fault === 'temp_warning') {
            newCells[7].temp = 65;
            newCells[8].temp = 62;
            return { bmsFault: 'temp_warning', cells: newCells };
        } else if (fault === 'cell_degradation') {
            newCells[3].voltage = 3.2;
            newCells[3].soc = 30;
            newCells[12].voltage = 4.1;
            newCells[12].soc = 90;
            return { bmsFault: 'cell_imbalance', cells: newCells };
        }
        return {};
    }),

    chargeStep: () => set(state => {
        const newCells = state.cells.map(c => ({
            ...c,
            soc: Math.min(100, c.soc + 5),
            voltage: Math.min(4.2, c.voltage + 0.1),
            temp: c.temp + 1
        }));
        return { 
            cells: newCells,
            sysVoltage: newCells.reduce((a, b) => a + b.voltage, 0),
            packSoc: newCells.reduce((a, b) => a + b.soc, 0) / newCells.length,
            packTemp: Math.max(...newCells.map(c => c.temp)),
            obcActive: true
        };
    }),

    tickSimulation: () => set(state => {
        // Only run if MSD is connected
        if (!state.msdConnected) return { timestamp: Date.now() };

        let sysVolt = 0;
        let avgSoc = 0;
        let maxT = -99;
        
        const newCells = state.cells.map(c => {
            let nc = { ...c };
            // Passive Balancing Simulation
            if (state.isBalancing && nc.soc > 50) {
                const targetSoc = Math.min(...state.cells.map(x => x.soc));
                if (nc.soc > targetSoc + 2) {
                    nc.balancing = true;
                    nc.soc = Math.max(0, nc.soc - 0.5);
                    nc.voltage = Math.max(3.0, nc.voltage - 0.01);
                    nc.temp = Math.min(80, nc.temp + 0.5);
                } else {
                    nc.balancing = false;
                    nc.temp = Math.max(25, nc.temp - 0.2);
                }
            } else {
                nc.balancing = false;
                nc.temp = Math.max(25, nc.temp - 0.2);
            }

            sysVolt += nc.voltage;
            avgSoc += nc.soc;
            maxT = Math.max(maxT, nc.temp);
            return nc;
        });

        // Motor physics simple simulation
        let nextRpm = state.motorRpm;
        let nextMotorTemp = state.motorTemp;
        let nextInvTemp = state.inverterTemp;
        let nextCurrent = state.sysCurrent;

        if (state.powerMode === 'READY') {
            // Idle simulated noise
            nextRpm = Math.max(0, nextRpm + (Math.random() * 10 - 5));
            if (nextRpm < 50) nextRpm = 100 + Math.random() * 50; 
            nextCurrent = 5 + Math.random() * 2;
            nextMotorTemp = Math.min(80, nextMotorTemp + 0.1);
            nextInvTemp = Math.min(65, nextInvTemp + 0.1);
        } else {
            nextRpm = Math.max(0, nextRpm - 50);
            nextCurrent = state.obcActive ? -15 : 0.1;
            nextMotorTemp = Math.max(22, nextMotorTemp - 0.5);
            nextInvTemp = Math.max(24, nextInvTemp - 0.5);
        }

        // Auto fault detection
        let currentFault = state.bmsFault;
        if (currentFault !== 'cell_imbalance' && currentFault !== 'msd_disconnected') {
            if (maxT >= 60) currentFault = 'temp_warning';
            else currentFault = 'none';
        }

        return {
            timestamp: Date.now(),
            cells: newCells,
            sysVoltage: sysVolt,
            packSoc: avgSoc / newCells.length,
            packTemp: maxT,
            motorRpm: nextRpm,
            motorTemp: nextMotorTemp,
            inverterTemp: nextInvTemp,
            sysCurrent: nextCurrent,
            bmsFault: currentFault
        };
    })
}));
