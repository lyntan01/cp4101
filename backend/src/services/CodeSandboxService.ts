import { SandboxFile } from "../types/page"

export class CodeSandboxService {
    async createSandbox(
        filesContent: Record<string, SandboxFile>
    ): Promise<string> {
        try {
            const response = await fetch(
                'https://codesandbox.io/api/v1/sandboxes/define?json=1',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: JSON.stringify({ files: filesContent })
                }
            )
            if (!response.ok) throw new Error('Network response was not ok.')

            const data = await response.json()
            return data.sandbox_id // Return the sandbox ID
        } catch (error) {
            console.error('Error creating sandbox:', error)
            throw new Error(`Failed to create code sandbox: ${error.message}`)
        }
    }
}
