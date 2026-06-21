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
    vehicleSpeed: number;
    throttle: number;
    regenLevel: number;
    driveMode: 'eco' | 'normal' | 'sport';
    torqueNm: number;
    powerKw: number;
    efficiencyKwhPer100: number;
    motorRpm: number;
    motorTemp: number;
    inverterTemp: number;
    obcActive: boolean;

    // Actions
    setPowerMode: (mode: 'OFF' | 'ACC' | 'READY') => void;
    setMsdConnected: (status: boolean) => void;
    setVehicleSpeed: (speed: number) => void;
    setThrottle: (throttle: number) => void;
    setRegenLevel: (level: number) => void;
    setDriveMode: (mode: 'eco' | 'normal' | 'sport') => void;
    setMotorRpm: (rpm: number) => void;
    setPackSoc: (soc: number) => void;
    setInverterTemp: (temp: number) => void;
    toggleBalancing: () => void;
    setFaultScenario: (fault: 'none' | 'temp_warning' | 'cell_degradation' | 'cooling_failure') => void;
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
    
    vehicleSpeed: 0,
    throttle: 0,
    regenLevel: 1,
    driveMode: 'normal',
    torqueNm: 0,
    powerKw: 0,
    efficiencyKwhPer100: 0,
    motorRpm: 0,
    motorTemp: 22,
    inverterTemp: 24,
    obcActive: false,

    setPowerMode: (mode) => set({ powerMode: mode }),
    setMsdConnected: (status) => set(state => ({ 
        msdConnected: status, 
        powerMode: status ? state.powerMode : 'OFF',
        bmsFault: status ? 'none' : 'msd_disconnected',
        vehicleSpeed: status ? state.vehicleSpeed : 0,
        throttle: status ? state.throttle : 0,
        motorRpm: status ? state.motorRpm : 0
    })),
    setVehicleSpeed: (speed) => set(state => {
        const safeSpeed = state.powerMode === 'READY' && state.msdConnected ? Math.max(0, Math.min(180, speed)) : 0;
        const rpm = safeSpeed * 92;
        const modeFactor = state.driveMode === 'sport' ? 1.22 : state.driveMode === 'eco' ? 0.82 : 1;
        const torque = safeSpeed === 0 ? 0 : Math.max(20, Math.min(360, (safeSpeed * 2.4 + state.throttle * 2.2) * modeFactor));
        const power = rpm * torque / 9550;
        return {
            vehicleSpeed: safeSpeed,
            motorRpm: rpm,
            torqueNm: torque,
            powerKw: power,
            sysCurrent: power > 0 ? (power * 1000) / Math.max(1, state.sysVoltage) : 0,
            efficiencyKwhPer100: safeSpeed > 0 ? Math.max(9, Math.min(32, 11 + safeSpeed * 0.075 + state.throttle * 0.065 + (state.driveMode === 'sport' ? 3 : 0))) : 0
        };
    }),
    setThrottle: (throttle) => set(state => {
        const nextThrottle = Math.max(0, Math.min(100, throttle));
        const speedBias = state.powerMode === 'READY' ? nextThrottle * (state.driveMode === 'sport' ? 1.6 : state.driveMode === 'eco' ? 1.05 : 1.3) : 0;
        return {
            throttle: nextThrottle,
            vehicleSpeed: Math.max(0, Math.min(180, speedBias)),
            motorRpm: Math.max(0, Math.min(180, speedBias)) * 92
        };
    }),
    setRegenLevel: (level) => set({ regenLevel: Math.max(0, Math.min(3, level)) }),
    setDriveMode: (mode) => set({ driveMode: mode }),
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
        } else if (fault === 'cooling_failure') {
            const overheatedCells = newCells.map((cell, index) => ({
                ...cell,
                temp: index >= 5 && index <= 10 ? 52 + Math.random() * 9 : 39 + Math.random() * 5
            }));
            return {
                bmsFault: 'temp_warning',
                cells: overheatedCells,
                packTemp: Math.max(...overheatedCells.map(c => c.temp)),
                obcActive: false
            };
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
        let nextSpeed = state.vehicleSpeed;
        let nextTorque = state.torqueNm;
        let nextPower = state.powerKw;
        let nextEfficiency = state.efficiencyKwhPer100;
        let nextMotorTemp = state.motorTemp;
        let nextInvTemp = state.inverterTemp;
        let nextCurrent = state.sysCurrent;

        if (state.powerMode === 'READY') {
            const modeFactor = state.driveMode === 'sport' ? 1.18 : state.driveMode === 'eco' ? 0.78 : 1;
            const targetSpeed = state.throttle * (state.driveMode === 'sport' ? 1.65 : state.driveMode === 'eco' ? 1.08 : 1.32);
            nextSpeed = Math.max(0, Math.min(180, nextSpeed + (targetSpeed - nextSpeed) * 0.18 - state.regenLevel * (state.throttle < 5 ? 1.2 : 0)));
            nextRpm = nextSpeed * 92 + (Math.random() * 25 - 12);
            nextTorque = nextSpeed < 1 ? 0 : Math.max(0, Math.min(390, (state.throttle * 3.0 + nextSpeed * 0.75) * modeFactor));
            nextPower = Math.max(0, nextRpm * nextTorque / 9550);
            nextCurrent = nextPower > 0 ? (nextPower * 1000) / Math.max(1, sysVolt) : 3 + Math.random() * 2;
            nextEfficiency = nextSpeed > 1 ? Math.max(8.5, Math.min(34, 10.5 + nextSpeed * 0.08 + state.throttle * 0.055 + (state.driveMode === 'sport' ? 3.2 : 0) - state.regenLevel * 0.8)) : 0;
            nextMotorTemp = Math.min(115, nextMotorTemp + nextPower * 0.006 - 0.15);
            nextInvTemp = Math.min(105, nextInvTemp + nextPower * 0.005 - 0.12);
        } else {
            nextRpm = Math.max(0, nextRpm - 50);
            nextSpeed = Math.max(0, nextSpeed - 3);
            nextTorque = 0;
            nextPower = 0;
            nextEfficiency = 0;
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
            vehicleSpeed: nextSpeed,
            motorRpm: nextRpm,
            torqueNm: nextTorque,
            powerKw: nextPower,
            efficiencyKwhPer100: nextEfficiency,
            motorTemp: nextMotorTemp,
            inverterTemp: nextInvTemp,
            sysCurrent: nextCurrent,
            bmsFault: currentFault
        };
    })
}));
