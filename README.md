```javascript
src/
├── form-builder/
├── components/           # Reusable form components
│   ├── custom-button/
│   ├── custom-checkbox/
│   ├── custom-datepicker/
│   ├── custom-radio/
│   ├── custom-select/
│   └── custom-text-field/
         # Core builder components
│   ├── helpers.js        # Utility functions
│   └── form.js   # Main component
├── hooks/                # Custom hooks
└── redux/                # Redux integration
```javascript

```javascript
import FormBuilder from '@your-repo/form-builder';
import { useForm } from 'react-hook-form';

function MyForm() {
  const formMethods = useForm();
  const formLayout = [
    {
      type: "section",
      inputs: [
        {
          type: "text",
          path: "firstName",
          label: "First Name",
          required: true
        },
        {
          type: "select",
          path: "gender",
          options: ["Male", "Female", "Other"]
        }
      ]
    }
  ];

  return (
    <FormBuilder
      formmethods={formMethods}
      formLayout={formLayout}
      onSubmit={(data) => console.log(data)}
    />
  );
}
```javascript
